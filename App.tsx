import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { getMergedTimeline, getUserTimeline, Post } from './src/services/bsky';

const { width } = Dimensions.get('window');

const RichText = ({ text, facets }: { text: string; facets?: any[] }) => {
  if (!facets || facets.length === 0) {
    return <Text style={styles.postText}>{text}</Text>;
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  const utf8Text = Buffer.from(text, 'utf8');

  facets.sort((a, b) => a.index.byteStart - b.index.byteStart).forEach((facet, i) => {
    if (facet.index.byteStart > lastIndex) {
      elements.push(utf8Text.slice(lastIndex, facet.index.byteStart).toString('utf8'));
    }

    const facetText = utf8Text.slice(facet.index.byteStart, facet.index.byteEnd).toString('utf8');
    const feature = facet.features[0];

    if (feature.$type === 'app.bsky.richtext.facet#link') {
      elements.push(
        <Text 
          key={i} 
          style={styles.link} 
          onPress={() => Linking.openURL(feature.uri)}
        >
          {facetText}
        </Text>
      );
    } else {
      elements.push(facetText);
    }

    lastIndex = facet.index.byteEnd;
  });

  if (lastIndex < utf8Text.length) {
    elements.push(utf8Text.slice(lastIndex).toString('utf8'));
  }

  return <Text style={styles.postText}>{elements}</Text>;
};

export default function App() {
  const [handle, setHandle] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursorMap, setCursorMap] = useState<Map<string, string> | undefined>(undefined);
  const [viewingUser, setViewingUser] = useState<{ handle: string; did: string } | null>(null);

  const fetchTimeline = async (isRefreshing = false, isLoadMore = false) => {
    if (!handle) return;
    
    if (isLoadMore) {
      if (loadingMore) return;
      setLoadingMore(true);
    } else if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);
    if (!isLoadMore) setViewingUser(null);

    try {
      const currentCursorMap = isLoadMore ? cursorMap : undefined;
      const result = await getMergedTimeline(handle, currentCursorMap);
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...result.posts]);
      } else {
        setPosts(result.posts);
      }
      setCursorMap(result.cursorMap);
    } catch (e: any) {
      console.error(e);
      setError('タイムラインの取得に失敗しました。IDを確認してください。');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const fetchUserTimeline = async (user: { handle: string; did: string }) => {
    setLoading(true);
    setError(null);
    setViewingUser(user);
    setCursorMap(undefined);
    try {
      const result = await getMergedTimeline(user.handle);
      setPosts(result.posts);
      setCursorMap(result.cursorMap);
    } catch (e: any) {
      console.error(e);
      setError('ユーザーのFollowingタイムライン取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const renderEmbed = (embed: any) => {
    if (!embed) return null;

    if (embed.$type === 'app.bsky.embed.images#view' || embed.$type === 'app.bsky.embed.images') {
      const images = embed.images || [];
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((img: any, i: number) => (
            <Image 
              key={i} 
              source={{ uri: img.thumb || img.image }} 
              style={styles.embeddedImage} 
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      );
    }

    if (embed.$type === 'app.bsky.embed.external#view' || embed.$type === 'app.bsky.embed.external') {
      const external = embed.external || embed.view?.external;
      if (!external) return null;
      return (
        <TouchableOpacity 
          style={styles.linkCard} 
          onPress={() => Linking.openURL(external.uri)}
        >
          {external.thumb && (
            <Image source={{ uri: external.thumb }} style={styles.linkThumb} />
          )}
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle} numberOfLines={1}>{external.title}</Text>
            <Text style={styles.linkDesc} numberOfLines={2}>{external.description}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {item.repostedBy && (
        <View style={styles.repostHeader}>
          <Text style={styles.repostText}>
            {item.repostedBy.displayName || item.repostedBy.handle} がリポストしました
          </Text>
        </View>
      )}
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => fetchUserTimeline({ handle: item.author.handle, did: item.author.did })}>
          {item.author.avatar ? (
            <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
        </TouchableOpacity>
        <View style={styles.authorInfo}>
          <Text style={styles.displayName}>{item.author.displayName || item.author.handle}</Text>
          <Text style={styles.handle}>@{item.author.handle}</Text>
        </View>
      </View>
      <RichText text={item.record.text} facets={item.record.facets} />
      {renderEmbed(item.embed)}
      <Text style={styles.timestamp}>{new Date(item.indexedAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {viewingUser ? `@${viewingUser.handle} が見ている世界` : 'Look at the world you see'}
          </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Bluesky ID (e.g. jay.bsky.social)"
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={() => { void fetchTimeline(); }} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? '...' : '見る'}</Text>
          </TouchableOpacity>
          {viewingUser && (
            <TouchableOpacity style={[styles.button, { backgroundColor: '#666' }]} onPress={() => { void fetchTimeline(); }}>
              <Text style={styles.buttonText}>戻る</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0085ff" />
          <Text style={styles.loadingText}>
            {viewingUser ? '投稿を取得中...' : 'フォロー一覧から投稿を集計中...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => item.uri + item.indexedAt + index}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={() => fetchTimeline(true)}
          onEndReached={() => {
            if (!viewingUser && posts.length > 0) {
              void fetchTimeline(false, true);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#0085ff" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && posts.length === 0 ? (
              <Text style={styles.emptyText}>IDを入力して「見る」を押してください</Text>
            ) : null
          }
        />
      )}
      <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0085ff',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0085ff',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  repostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  repostText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorInfo: {
    justifyContent: 'center',
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  handle: {
    color: '#666',
    fontSize: 14,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  link: {
    color: '#0085ff',
  },
  imageScroll: {
    marginBottom: 10,
  },
  embeddedImage: {
    width: width * 0.7,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  linkCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  linkThumb: {
    width: '100%',
    height: 150,
  },
  linkInfo: {
    padding: 10,
  },
  linkTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  linkDesc: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
