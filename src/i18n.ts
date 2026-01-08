export type Language = 'ja' | 'en';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  inputPlaceholder: string;
  viewButton: string;
  backButton: string;
  viewingWorld: string;
  loadingFollows: string;
  loadingPosts: string;
  errorFetchTimeline: string;
  errorFetchUserTimeline: string;
  repostedBy: string;
  emptyInput: string;
  emptyPosts: string;
  noSuggestions: string;
}

const translations: Record<Language, Translations> = {
  ja: {
    appTitle: 'Look at the world you see',
    appSubtitle: 'BlueskyのIDを入力して、その人が見ている世界を覗いてみましょう',
    inputPlaceholder: 'jay.bsky.social',
    viewButton: '見る',
    backButton: '←',
    viewingWorld: 'が見ている世界',
    loadingFollows: 'フォロー一覧から投稿を集計中...',
    loadingPosts: '投稿を取得中...',
    errorFetchTimeline: 'タイムラインの取得に失敗しました。IDを確認してください。',
    errorFetchUserTimeline: 'ユーザーのFollowingタイムライン取得に失敗しました。',
    repostedBy: 'がリポストしました',
    emptyInput: 'IDを入力して「見る」を押してください',
    emptyPosts: '投稿が見つかりませんでした',
    noSuggestions: '検索結果がありません',
  },
  en: {
    appTitle: 'Look at the world you see',
    appSubtitle: 'Enter a Bluesky ID to see the world through their eyes',
    inputPlaceholder: 'jay.bsky.social',
    viewButton: 'View',
    backButton: '←',
    viewingWorld: "'s world",
    loadingFollows: 'Loading posts from follows...',
    loadingPosts: 'Loading posts...',
    errorFetchTimeline: 'Failed to fetch timeline. Please check the ID.',
    errorFetchUserTimeline: "Failed to fetch user's following timeline.",
    repostedBy: 'reposted by',
    emptyInput: 'Enter an ID and press "View"',
    emptyPosts: 'No posts found',
    noSuggestions: 'No results found',
  },
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};

export const detectLanguage = (): Language => {
  // Default to Japanese
  // TODO: Enhance with platform-specific language detection using expo-localization
  // e.g., import * as Localization from 'expo-localization';
  // const locale = Localization.locale; // Returns 'ja-JP', 'en-US', etc.
  // return locale.startsWith('ja') ? 'ja' : 'en';
  return 'ja';
};
