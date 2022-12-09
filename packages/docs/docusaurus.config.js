// @ts-check
/** @type {import('@docusaurus/types').Config} */
module.exports = {
    title: "tRPC.panel()",
    tagline: "A Testing UI that moves as fast as your tRPC backend.",
    url: "https://trpcpanel.io",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "throw",
    onDuplicateRoutes: "throw",
    favicon: "img/favicon.ico",
    organizationName: "iway1", // Usually your GitHub org/user name.
    projectName: "trpc-panel", // Usually your repo name.
    themeConfig: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
        prism: {
            theme: require("prism-react-renderer/themes/vsDark"),
        },

        navbar: {
            title: "tRPC.panel()",
            logo: {
                alt: "tRPC Panel logo",
                src: "img/logo.svg",
            },
            items: [
                // Don't need this right now since there is only a doc site
                // {
                //     to: "docs",
                //     label: "Docs",
                //     activeBaseRegex: "docs(/?)$",
                // },
                {
                    to: "docs/quickstart",
                    label: "Quickstart",
                },

                {
                    href: "https://twitter.com/isaac_ts_way",
                    position: "right",
                    className: "header-social-link header-twitter-link",
                    "aria-label": "Twitter",
                },
            ],
        },
        footer: {
            // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
        },
    },
    // plugins: [
    //     async function myPlugin() {
    //         return {
    //             name: "docusaurus-tailwindcss",
    //             configurePostCss(postcssOptions) {
    //                 // Appends TailwindCSS, AutoPrefixer & CSSNano.
    //                 /* eslint-disable @typescript-eslint/no-var-requires */
    //                 postcssOptions.plugins.push(require("tailwindcss"));
    //                 postcssOptions.plugins.push(require("autoprefixer"));
    //                 if (process.env.NODE_ENV === "production") {
    //                     postcssOptions.plugins.push(require("cssnano"));
    //                 }
    //                 /* eslint-enable @typescript-eslint/no-var-requires */
    //                 return postcssOptions;
    //             },
    //         };
    //     },
    // ],
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    lastVersion: "current",
                    // disableVersioning: true,
                    // onlyIncludeVersions: ['9.x'],

                    // includeCurrentVersion: false,
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/iway1/trpc-panel/packages/docs",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
};
