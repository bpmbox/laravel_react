/**
 * US English
 * This is also the default locale.  This file should be kept up to date with
 * all new added text so it can be sent to translation vendors to translate.
 *
 * Translations support Fluent format: https://projectfluent.org/
 */
export default {
    // Try to keep namespaces in alphabetical order, to make it easier to compare.

    // This is a namespace, components are generally separated by name spaces, with Brand, Common, and Erors being shared ones.
    /**
     * Brand namespace is used for branding items like product name, product URL, etc...
     */
    Brand: {
        // This is a tranlation key within a namespace.  "Key":"Value"
        "Tree": "Tree",
        "www.withtree.com/": "www.withtree.com/",
        "An Error has occurred. Please try again later.": "An Error has occurred. Please try again later.",
    },
    /**
     * Common namespace is used for things like formatting, this can be shared across our entire site.
     */
    Common: {
        "Back": "Back",
        "Error": "Error",
    },
    /**
     * Lookup for error messages.
     */
Errors: {
        "400-1000": "Not found.",
        "000-400-0003": "Please check your input and try again.",
        "002-409-0001": "The email you used is already taken.",
        "002-409-0004": "The domain is already taken.",
        "000-403-0004": "You do not have permissions to perform this action.",
        "002-403-0017": "You are the only Owner of this space. In order to leave the Space, please set another Owner first.",
        "002-403-0018": "You cannot remove a user with a higher role.",
        "002-403-0019": "You do not have the permission to set a role with more privileges than your current role.",
        "002-403-0020": "You do not have the permissions to change the role of another Admin.",
        "002-403-0021": "You are the only Owner of this space, so you cannot change your role. To change your role, grant Owner role to another space member first.",
        "002-409-0022": "An invitation has already been sent to this user.",
        "002-409-0006": "User has already joined this space.",
    },
   // Other name spaces generally follow the name of their respective components.
    AvatarUpload: {
        "Click to upload a new image": "クリックして新しい画像をアップロード",
        "Drop your image": "画像をドロップ",
    },
    LocaleSwitcher: {
        "Select language": "言語を選択してください。"
    },
    LoadingIndicator: {
        "Loading": "読み込み中・・・",
    },
    LoginPage: {
        "Log in with Apple": "Appleでログイン ",
        "Log in with Google": "Googleでログイン",
        "Google Login Error": "Googleでログインエラー",
        "Google Play Services are not available": "Google Playサービスは利用できません。",
        // This is an example when a <Trans> tag is used on top of nested elements.
        "or log in with <1>your email</1>.": "または<1>your email</1>でログインしてください。",
        "Log In": "ログイン",
        "Email": "メール",
        "Log in with Email": "メールアドレスでログイン",
        "Enter your email...": "メールアドレスを入力・・・",
        "Please enter a valid email address.": "有効なメールアドレスを入力してください.",
        "Email is required": "メールアドレスが必要です。",
        "Enter validation code": "認証コードを入力してください",
        // Here is an example of string iterpolation used in a translation key.  Double braces denotes interpolated value.
        "A login code has been sent to {{userEmail}}. Please enter it below.": "ログインコードが {{userEmail}} に送信されました。以下にコードを入力してください。",
        "Continue with Login Code": "ログインコードを続行",
        "Didn't receive it? <1>Resend login code</1>.": "受信出来ませんでしたか? <1>Resend login code</1>.",
    },
  MainFooter: {
        "<0><0><0>Tree</0></0></0><1><0>Download for Android & iOS</0><1>Marketplace</1><2>What's New</2><3>Roadmap</3><4>Learning Resources</4><5>Admin Panel Login</5><6>Developers</6></1>": "<0><0><0>Tree</0></0></0><1><0>Download for Android & iOS</0><1>Marketplace</1><2>What's New</2><3>Roadmap</3><4>Learning Resources</4><5>Admin Panel Login</5><6>Developers</6></1>",
        "<0><0>Showcase</0></0><1>News</1><2><0>Press</0><1>Media Kit</1><2>Twitter</2><3>LinkedIn</3></2><3><0>Blog</0></3>": "<0><0>Showcase</0></0><1>News</1><2><0>Press</0><1>Media Kit</1><2>Twitter</2><3>LinkedIn</3></2><3><0>Blog</0></3>",
        "Copyright © {{currentYear}} Tree Technologies, Inc.": "Copyright © {{currentYear}} Tree Technologies, Inc.",
        "<0>Company</0><1><0>Our Mission</0><1>Culture</1><2>Jobs</2></1><2>Terms and Policies</2><3><0>Privacy Policy</0><1>Terms and Conditions</1></3>": "<0>Company</0><1><0>Our Mission</0><1>Culture</1><2>Jobs</2></1><2>Terms and Policies</2><3><0>Privacy Policy</0><1>Terms and Conditions</1></3>",
        "EU Headquarters": "EU Headquarters",
        "US Headquarters": "US Headquarters",
        "Contact Us": "Contact Us",
    },
   MainNavBar: {
        "App": "アプリ",
        "Showcase": "ショーケース",
        "Marketplace": "マーケット",
        "Learn": "学習",
    },
    NotFoundPage: {
        "Page Not Found": "Page Not Found",
        "Looks like you've followed a broken link or entered a URL that doesn't exist on this site.": "Looks like you've followed a broken link or entered a URL that doesn't exist on this site.",
        "<0>Back to our site</0>": "<0>Back to our site</0>",
    },
    OnboardingCreateSpacePage: {
        "Space name is required.": "スペース名が必須です。",
        "Only valid URL characters allowed.": "URL に有効な文字しか使用できません。",
        "Enter a name for your space...": "スペースの名前を入れてください・・・",
        "URL": "URL",
        "Let's setup a space": "スペースのセットアップをしましょう",
        "Space Name": "スペース名",
        "Space URL (optional)": "スペース URL (オプション)",
        "Invite people to join your space by sharing this link.": "このリンクを共有して、スペースに招待してください。",
        "A space is where your community comes to life.  You can create other spaces later.": "スペースにてあなたのコミュニティが命を得ます。 後で他のスペースを作成できます。",
    },
     OnboardingJoinSpacePage: {
        "Join a space": "スペースに参加してください。",
        "A space is where your community comes to life.  You can create other spaces later.": "スペースにてあなたのコミュニティが命を得ます。 後で他のスペースを作成できます。",
        "You are already part of <1>{{numberOfSpacesText}} spaces</1>, make sure to join them!": "You are already part of <1>{{numberOfSpacesText}} spaces</1>, make sure to join them!",
        "You can also <1><0>create a space</0></1>": "You can also <1><0>create a space</0></1>",
        "You are already part of <1>{{spaces}}</1>, make sure to join them!": "You are already part of <1>{{spaces}}</1>, make sure to join them!",
        // Example of plurals
        "SPACECOUNT": "スペース",
        "SPACECOUNT_plural": "{{count}} スペース",
    },
        OnboardingAccountPage: {
        "Welcome to {{product}}": "{{product}} へようこそ",
        "Before we get started, tell us a bit about yourself": "始める前に、あなた自身について少し教えてください。",
        "Profile Picture": "プロフィール写真",
        "FAMILY_NAME_FIRST": "True",
        "Last Name": "苗字",
        "First Name": "名前",
        "Enter your last name": "苗字を入力してください。",
        "Enter your first name": "名前を入力してください。",
        "First name is required.": "名前が必要です。",
        "Last name is required.": "苗字が必要です。",
        "What will you use {{product}} for?": " {{product}} は何に使いますか?",
        "Please select what you will use {{product}} for.": "{{product}} の用途を選択してください。",
        "Personal Use": "個人使用",
        "My Company": "会社用",
        "My Building or Portfolio": "建物もしくはポートフォリオ用",
        "My Community": "コミュニティ用",
        "Please select an option above.": "上記のオプションを選択してください。",
        "Next": "次",
    },
        IntegrationsConsolePage: {
        "Edit Integrations": "インテグレーションの編集",
        "Create an Integration": "インテグレーションを作成",
        "Examples": "例",
        "Docs": "ドキュメント",
        "Name": "名前",
        "Short description": "簡単な説明",
        "Full description": "詳しい説明",
        "Category": "カテゴリー",
        "aaaaa": "設定",
        "Integration type": "インテグレーションタイプ",
        "Learn more about integration types": "インテグレーションタイプについての詳細",
        "Integration URL": "インテグレーションURL",
        "Learn more about integration URLs": "インテグレーションURLについての詳細",
        "Permissions": "権限",
        "Learn more about permissions": "権限についての詳細",
        "Access": "アクセス",
        "Learn more about Marketplace access": "マーケットへのアクセスについての詳細",
        "Create": "作成",
        "Cancel": "キャンセル",
        "Select a Category": "カテゴリーを選択してください。",
        "Select an Integration type": "インテグレーションタイプを選択してください。",
        "Select Access": "アクセスを選択してください。",
        "New Integration": "新規インテグレーション",
        "Edit Integration": "インテグレーションの編集",
        "Integration created successfully": "インテグレーションが正常に作成されました。",
    },
    SpaceParentFrame: {
        "People": "友達",
        "Settings": "設定",
        "Integrations": "インテグレーション",
    },
    SpaceSettingsPage: {
        "space1": "スペース名",
        "Space domain": "スペースドメイン",
        "Danger Zone": "危険",
        "Delete Space": "スペースを削除",
        "Leave Space": "スペースを離れる"
    },
   SpacePeoplePage: {
        "Owner": "オーナー",
        "Admin": "管理者",
        "Member": "メンバー",
        "Search people...": "友達を検索・・・",
        "People": "友達",
        "User Groups": "グループ",
        "People ({{peopleCount}})": "友達 ({{peopleCount}})",
        "Invite": "招待",
        "Error removing user.":"ユーザーの削除中にエラーが発生しました。",
    },
    SpacePeopleInviteModal: {
        "Owner": "オーナー",
        "Admin": "管理者",
        "Member": "メンバー",
    },
    SpacePeoplePageMemberDropdown: {
        "(current)": "(現在)",
        "Owner": "オーナー",
        "Member": "メンバー",
        "Admin": "管理者",
        "Guest": "ゲスト",
        "In addition to Member permissions, can change space settings and invite Members and Guests.": "メンバーの権限に加えて、スペース設定を変更したり、メンバーとゲストを招待したりできます。",
        "Can access allowed services but cannot initiate chats with Members.":"許可されたサービスにアクセスできますが、メンバーとのチャットを開始することはできません。",
        "Can access allowed services and can initiate chats with Members and Guests.":"許可されたサービスにアクセスでき、メンバーおよびゲストとのチャットを開始できます。",
        "In addition to Admin permissions, can invite other Admins and Owners, and delete the space.":"管理者権限に加えて、他の管理者とオーナーを招待したり、スペースを削除することができます。",
        "Remove from Space":"スペースから削除",
    },
    IntegrationsMarketplacePage: {

    },
    MessageToast: {
        "Just a moment ago.": "少し前",
        "Message": "メッセージ",
        "Error":"エラー",
    },
   SpaceGroupsPage: {
        "Create a User Group": "グループの作成",
        "Configure": "構成",
        "{{memberCount}} members": "{{memberCount}} 人のメンバー",
        "User Groups  ({{groupCount}})": "グループ ({{groupCount}})",
        "People": "友達",
        "User Groups": "グループ",
        "Search groups...": "グループを検索・・・",
        "Create User Group": "グループを作成",
    },
    CreateGroupModal: {
        "Enter group name": "グループ名を入力",
        "Name contains invalid characters.": "名前に無効な文字が含まれています。",
        "Name is required.": "名前が必要です。",
        "Create User Group": "グループを作成",
    },
    UserPicker: {
        "Everyone": "全員",
        "No results": "結果がありません。",
        "Results": "結果",
        "Search": "検索",
        "User Groups": "グループ",
        "User Picker": "ユーザー選択",
    },
     CreateIntegrationPage:{
    "Short Description":"短い説明",
    "Integration created.":"Integration created.",
    "Error creating integration.":"Error creating integration.",
    "Name":"名前",
    "Enter a name":"名前を登録",
    "Enter a short description":"簡単な説明を入力してください",
    "At least 10 chars, at most 100.":"10文字以上、最大100文字",
    "Full Description":"長い説明",
    "Enter full description":"詳細を登録して下さい",
    "Category":"カテゴリー",
    "Select a Category":"カテゴリーを選択して下さい",
    "Create Integration":"インテグレーション作成",
    },
    EditIntegrationPage:{
       "Failed to update integration after a detected change.":"Failed to update integration after a detected change.",
       "General":"General",
       "Settings" :"Settings",
       "Access":"Access",
    },
   IntegrationConfigurationPage:{
       "Changes saved.":"変更を保存しました",
       "Error updating integration.":"インテグレーションの保存に失敗しました",
       "UI Hook":"UI Hook",
       "Enter URL":"URLを登録して下さい",
       "Permissions":"パーミッション",
       "Select Permissions":"パーミッションの選択",
   },
     IntegrationGeneralPage:{
       "Saving changes.":"変更を保存中です",
       "Changes saved.":"変更を保存しました",
       "Error updating integration.":"インテグレーションのアップに失敗しました",
       "Invalid input.":"入力が正しくありません",
       "The integration will no longer be available to any user.":"インテグレーションは他のユーザーで使用可能ではありません",
       "Cancel":"キャンセル",
       "Change Icon":"ICON変更",
       "Name":"名前",
       "Set Icon":"ICONセット",
       "Enter a name":"名前を登録して下さい",
       "Short Description":"要約",
       "Enter full description":"詳細",
       "Select a Category":"カテゴリー選択",
       "Danger Zone":"Danger Zone",
       "Delete Integration":"インテグレーション削除",

   },
   IntegrationPublicationPage:{
       "Changes saved.":"変更を保存",
       "Error updating integration.":"インテグレーションの更新に失敗しました",
       "Access":"アクセス",
       "Select access type":"アクセス権限の選択",
       "Restricted to spaces":"Restricted to spaces",
       "[Learn more about Marketplace access](https://treedocs.now.sh/docs/v1/getting-started/)`":"[Learn more about Marketplace access](https://treedocs.now.sh/docs/v1/getting-started/)`",
   },
       IntegrationsPage:{
        "Installed":"インストール済み",
        "Marketplace":"マーケット",
        "My Integrations":"マイインテグレーション",
    },
    RequestAccessPage:{
        "Tree is currently in closed beta.":"Tree is currently in closed beta.",
        "We will notify you once ready.":"We will notify you once ready.",
        "Request Early Access":"Request Early Access",
        "RequestAccessPage::Request Access":"リクエストアクセス",
    },
     GroupPickerPage:{
        "Unable to retrieve groups.":"グループを取得できません",
        "Filter by name...":"名前で検索・・・",
        "No results.":"結果がありません。",
        "All groups have been added.":"すべてのグループが追加されました"
    },
     SpaceNavigator:{
        "Unable to fetch space. Please verify your network and reload the app.":"スペースを取得できません。ネットワークを確認して、アプリをリロードしてください。",

    },
    PeoplePickerPage:{
        "Unable to retrieve members.":"メンバーを取得できません。",
        "Loading space members...":"スペースメンバーを読み込んでいます...",
        "Filter by name...":"名前でフィルタリング...",
        "No results.":"結果がありません。",
        "Done":"完了",
    },
     CreateChatPage:{
        "There are no members in this space.":"このスペースにはメンバーがいません。",
    },
    AddSpacePage:{
      "Error":"エラー",
      "Error occurred while trying to join space":"スペースに参加しようとしたときにエラーが発生しました",
      "Error occurred while trying to join {{spaceName}}.":"Error occurred while trying to join {{spaceName}}.",
      "A space is where your community comes to life. You can create spaces or join spaces that you have been invited to.":"スペースはあなたのコミュニティが生き返る場所です。招待されたスペースを作成したり、スペースに参加したりできます。",
      "A space is where your community comes to life. Create a space now and invite people to join it.":"スペースはあなたのコミュニティが活性化する場所です。今すぐスペースを作成して、参加者を招待してください。",
      "Create a Space":"スペースを作成する",
      "Spaces you've been invited to":"招待されたスペース",
      "Using account: {{email}}'":"Using account: {{email}}'",

    },
     "Chat::ChatSplitPage":{
        "Inbox":"inbox",
        "New Message":"新規メッセージ",
    },
    "Chat::ConversationPage":{
        "Error loading messages:":"メッセージ取得エラー",
        "Unable to send image.":"画像を送信出来ません",
        "Unable to send message.":"メッセージを送信出来ません",
        "Sending image...":"イメージ送信",
        "Conversation not found":"コネクションが見つかりません",
        "Type something...`":"何かを入力して下さい",
    },
    "Chat::ConversationSettingsPage":{
        "Conversation not found.":"会話が見つかりません。",
        "Conversation deleted.":"会話が削除されました。",
        "Unable to delete conversation.":"会話を削除できません。",
        "Delete Conversation?":"会話を削除しますか？",
        "Could not load your profile info.":"プロフィール情報を読み込めませんでした。",
        "Danger Zone":"Danger Zone",
    },
    "Chat::CreateChannelPage":{
        "Duplicate conversation name. Please choose a unique name.":"Duplicate conversation name. Please choose a unique name.",
        "The channel has been created.":"チャネルが作成されました。",
        "Unable to create channel.":"チャネルを作成できません。",
        "Enter channel name...":"チャネル名を入力してください...",
        "Description":"説明",
        "Channel description (optional)":"チャネルの説明（オプション）",
        "Private channel":"プライベートチャネル",
        "Private channels are accessible only by invitation.":"プライベートチャンネルには招待制でのみアクセスできます。",
        "Members":"メンバー",
        "Add members":"メンバー追加",
    },
     ConversationPage:{
        "No conversation selected.":"会話が選択されていません。",
    },
    "Chat::InboxPage":{
        "New Message":"新しいメッセージ",
        "No conversations.":"会話はありません",
    },
    "NativeIntegrationPage":{
        "Error loading content.":"コンテンツの読み込み中にエラーが発生しました。",
    },
    IntegrationsListPage:{
        "Error loading integrations.":"Error loading integrations.",
        "No integrations on this space.":"このスペースでのインテグレーションはありません。",
    },
    SettingsMainPage:{
       "Accounts" :"アカウント",
       "System Authorizations":"システム認証",
       "Preferences":"環境設定",
       "Support":"サポート",
       "What's new":"新着情報",
       "Send Feedback":"フィードバック送信",
    },
     SpaceSettingsMenu:{
        "Settings":"設定",
        "People":"友達",
        "Integrations":"インテグレーション",
    },
    AccountSettingsPage:{
        "Your account has been updated.":"Your account has been updated.",
        "Unable to update your account.":"Unable to update your account.",
        "Error logging out.":"Error logging out.",
        "Are you sure you want to log out?":"本当にログアウトしますか？",
        "Delete your account?":"アカウントを削除しますか?",
        "Change Photo":"写真を変更",
        "avatarUrl":"avatarUrl",
        "Personal Info":"個人情報",
        "givenName":"givenName",
        "familyName":"familyName",
        "Account":"アカウント",
        "Log Out":"Log Out",
        "Version: {{version}}":"バージョン: {{version}}",
        "Delete Account":"アカウント削除",
        "Update":"更新",
    },
     ChangeEmailCodePage:{
        "[our email has been updated.":"Your email has been updated.",
        "Verification code":"Verification code",
        "Didn't receive it? Resend verification code":"Didn't receive it? Resend verification code",
        "Next":"Next"
    },
    ConfirmJoinSpacePage:{
        "Please check your URL and try again.":"Please check your URL and try again.",
        "Brand::Tree":"Brand::Tree"
    },
    DatePickerPage:{
      "End Date":"End Date",
      "Include Time":"Include Time",
      "Clear":"Clear"
    },
    IntegrationPage:{
        "Unable to load the page.":"Unable to load the page.",
        "Error reaching integration.":"Error reaching integration."
    },
    EnterLoginCodePage:{
        "EnterLoginCodePage":"ログインコードを入力してください",
        "A new login code has been sent to {{email}}.":"新しいログインコードが{{email}}に送信されました",
        "Enter Your Login Code":"送信されたログインコードを入力してください",
        "Login code":"ログインコード",
        "Next":"次へ"
    },
    EnterEmailPage:{
        "Enter Your Email":"メールアドレスを入力して下さい",
        "Next":"次へ",
    },
    HomePage:{
        "Log In":"ログイン",
         "Log in with Apple": "Appleでログイン ",
        "Log in with Google": "Googleでログイン",
        "Google Login Error": "Googleでログインエラー",
        "Google Play Services are not available": "Google Playサービスは利用できません。",
        // This is an example when a <Trans> tag is used on top of nested elements.
        "or log in with <1>your email</1>.": "または<1>your email</1>でログインしてください。",
        "Email": "メール",
        "Log in with Email": "メールアドレスでログイン",
        "Enter your email...": "メールアドレスを入力・・・",
        "Please enter a valid email address.": "有効なメールアドレスを入力してください。",
        "Email is required": "メールアドレスが必要です。",
        "Enter validation code": "認証コードを入力してください。",
        // Here is an example of string iterpolation used in a translation key.  Double braces denotes interpolated value.
        "A login code has been sent to {{userEmail}}. Please enter it below.": "ログインコードが {{userEmail}} に送信されました。以下にコードを入力してください。",
        "Continue with Login Code": "ログインコードを続行",
        "Didn't receive it? <1>Resend login code</1>.": "受信出来ませんでしたか? <1>Resend login code</1>.",
    },
    PeoplePage:{
       "People":"友達",
       "Groups":"グループ",
    },
    AccessItem:{
       "AccessItem":"アイテムにアクセス",
        "Configure":"設定",
    }
};
