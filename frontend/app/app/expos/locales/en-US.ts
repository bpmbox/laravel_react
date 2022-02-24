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
        "Click to upload a new image": "Click to upload a new image",
        "Drop your image": "Drop your image",
    },
    LocaleSwitcher: {
        "Select language": "Select language"
    },
    LoadingIndicator: {
        "Loading": "Loading...",
    },
    LoginPage: {
        "Log in with Apple": "Log in with Apple",
        "Log in with Google": "Log in with Google",
        "Google Login Error": "Google Login Error",
        "Google Play Services are not available": "Google Play Services are not available",
        // This is an example when a <Trans> tag is used on top of nested elements.
        "or log in with <1>your email</1>.": "or log in with <1>your email</1>.",
        "Log In": "Log In",
        "Email": "Email",
        "Log in with Email": "Log in with Email",
        "Enter your email...": "Enter your email...",
        "Please enter a valid email address.": "Please enter a valid email address.",
        "Email is required": "Email is required",
        "Enter validation code": "Enter validation code",
        // Here is an example of string iterpolation used in a translation key.  Double braces denotes interpolated value.
        "A login code has been sent to {{userEmail}}. Please enter it below.": "A login code has been sent to {{userEmail}}. Please enter it below.",
        "Continue with Login Code": "Continue with Login Code",
        "Didn't receive it? <1>Resend login code</1>.": "Didn't receive it? <1>Resend login code</1>.",
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
        "App": "App",
        "Showcase": "Showcase",
        "Marketplace": "Marketplace",
        "Learn": "Learn",
    },
    NotFoundPage: {
        "Page Not Found": "Page Not Found",
        "Looks like you've followed a broken link or entered a URL that doesn't exist on this site.": "Looks like you've followed a broken link or entered a URL that doesn't exist on this site.",
        "<0>Back to our site</0>": "<0>Back to our site</0>",
    },
    OnboardingCreateSpacePage: {
        "Space name is required.": "Space name is required.",
        "Only valid URL characters allowed.": "Only valid URL characters allowed.",
        "Enter a name for your space...": "Enter a name for your space...",
        "URL": "URL",
        "Let's setup a space": "Let's setup a space",
        "Space Name": "Space Name",
        "Space URL (optional)": "Space URL (optional)",
        "Invite people to join your space by sharing this link.": "Invite people to join your space by sharing this link.",
        "A space is where your community comes to life.  You can create other spaces later.": "A space is where your community comes to life.  You can create other spaces later.",
    },
    OnboardingJoinSpacePage: {
        "Join a space": "Join a space",
        "A space is where your community comes to life.  You can create other spaces later.": "A space is where your community comes to life.  You can create other spaces later.",
        "You are already part of <1>{{numberOfSpacesText}} spaces</1>, make sure to join them!": "You are already part of <1>{{numberOfSpacesText}} spaces</1>, make sure to join them!",
        "You can also <1><0>create a space</0></1>": "You can also <1><0>create a space</0></1>",
        "You are already part of <1>{{spaces}}</1>, make sure to join them!": "You are already part of <1>{{spaces}}</1>, make sure to join them!",
        // Example of plurals
        "SPACECOUNT": "one space",
        "SPACECOUNT_plural": "{{count}} spaces",
    },
    OnboardingAccountPage: {
        "Welcome to {{product}}": "Welcome to {{product}}",
        "Before we get started, tell us a bit about yourself": "Before we get started, tell us a bit about yourself",
        "Profile Picture": "Profile Picture",
        "FAMILY_NAME_FIRST": "false",
        "Last Name": "Last Name",
        "First Name": "First Name",
        "Enter your last name": "Enter your last name",
        "Enter your first name": "Enter your first name",
        "First name is required.": "First name is required.",
        "Last name is required.": "Last name is required.",
        "What will you use {{product}} for?": "What will you use {{product}} for?",
        "Please select what you will use {{product}} for.": "Please select what you will use {{product}} for.",
        "Personal Use": "Personal Use",
        "My Company": "My Company",
        "My Building or Portfolio": "My Building or Portfolio",
        "My Community": "My Community",
        "Please select an option above.": "Please select an option above.",
        "Next": "Next",
    },
    IntegrationsConsolePage: {
        "Edit Integrations": "Edit Integrations",
        "Create an Integration": "Create an Integration",
        "Examples": "Examples",
        "Docs": "Docs",
        "Name": "Name",
        "Short description": "Short description",
        "Full description": "Full description",
        "Category": "Category",
        "sssss": "Settingssssssss",
        "Integration type": "Integration type",
        "Learn more about integration types": "Learn more about integration types",
        "Integration URL": "Integration URL",
        "Learn more about integration URLs": "Learn more about integration URLs",
        "Permissions": "Permissions",
        "Learn more about permissions": "Learn more about permissions",
        "Access": "Access",
        "Learn more about Marketplace access": "Learn more about Marketplace access",
        "Create": "Create",
        "Cancel": "Cancel",
        "Select a Category": "Select a Category",
        "Select an Integration type": "Select an Integration type",
        "Select Access": "Select Access",
        "New Integration": "New Integration",
        "Edit Integration": "Edit Integration",
        "Integration created successfully": "Integration created successfully",
    },
    SpaceParentFrame: {
        "People": "People",
        "ssss": "Settissssngs",
        "Integrations": "Integrations",
    },
    SpacePeoplePage: {
        "Owner": "Owner",
        "Admin": "Admin",
        "Member": "Member",
        "Search people...": "Search people...",
        "People": "People",
        "User Groups": "User Groups",
        "People ({{peopleCount}})": "People ({{peopleCount}})",
        "Invite": "Invite",
        "Error removing user.":"Error removing user.",
    },
    SpacePeopleInviteModal: {
        "Owner": "Owner",
        "Admin": "Admin",
        "Member": "Member",
    },
    SpacePeoplePageMemberDropdown: {
        "(current)": "(current)",
        "Owner": "Owner",
        "Member": "Member",
        "Admin": "Admin",
        "Guest": "Guest",
        "In addition to Member permissions, can change space settings and invite Members and Guests.": "In addition to Member permissions, can change space settings and invite Members and Guests.",
        "Can access allowed services but cannot initiate chats with Members.":"Can access allowed services but cannot initiate chats with Members.",
        "Can access allowed services and can initiate chats with Members and Guests.":"Can access allowed services and can initiate chats with Members and Guests.",
        "In addition to Admin permissions, can invite other Admins and Owners, and delete the space.":"In addition to Admin permissions, can invite other Admins and Owners, and delete the space.",
        "Remove from Space":"Remove from Space",
    },
    IntegrationsMarketplacePage: {

    },
    MessageToast: {
        "Just a moment ago.": "Just a moment ago.",
        "Message": "Message",
        "Error":"Error",
    },
    SpaceGroupsPage: {
        "Create a User Group": "Create a User Group",
        "Configure": "Configure",
        "{{memberCount}} members": "{{memberCount}} members",
        "User Groups  ({{groupCount}})": "User Groups  ({{groupCount}})",
        "People": "People",
        "User Groups": "User Groups",
        "Search groups...": "Search groups...",
        "Create User Group": "Create User Group",
    },
    CreateGroupModal: {
        "Enter group name": "Enter group name",
        "Name contains invalid characters.": "Name contains invalid characters.",
        "Name is required.": "Name is required.",
        "Create User Group": "Create User Group",
    },
    UserPicker: {
        "+ Add People": "+ Add People",
        "Everyone": "Everyone",
        "No results": "No results",
        "Results": "Results",
        "Search": "Search",
        "User Groups": "User Groups",
        "User Picker": "User Picker",
    },
};
