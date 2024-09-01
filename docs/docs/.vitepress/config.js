import { defineConfig } from "vitepress";
import { createWriteStream } from "node:fs";
import { resolve } from "node:path";
import { SitemapStream } from "sitemap";
import fs from "fs";
import path from "path";

const links = [];

const sidebarGuide = () => [
  {
    text: "Getting Started",
    collapsed: false,
    items: [
      {
        text: "Quick start",
        link: "/learn/quick-start",
      },
      { text: "Tutorial: Bookstore API", link: "/learn/bookstore-api" },
    ],
  },
  {
    text: "Fundamentals",
    collapsed: true,
    items: [
      { text: "What does a Model mean?", link: "/learn/models" },
      { text: "Understanding the routing", link: "/learn/routing" },
      { text: "Version management", link: "/learn/version-management" },
      { text: "Validate your data", link: "/learn/validations" },
    ],
  },
  {
    text: "Gains",
    collapsed: true,
    items: [
      { text: "Auto-created documentation", link: "/learn/documentation" },
      { text: "Querying data", link: "/learn/querying-data" },
      { text: "Related data queries", link: "/learn/related-data-queries" },
      { text: "Auto-caching", link: "/learn/caching" },
      { text: "Full-text search", link: "/learn/full-text-search" },
      {
        text: "JavaScript Client",
        link: "/learn/javascript-client-axe-api-client",
      },
      {
        text: "How DB Analyzer works?",
        link: "/learn/db-analyzer",
      },
    ],
  },
  {
    text: "Application Logic",
    collapsed: true,
    items: [
      { text: "Getting started", link: "/learn/application-logic" },
      { text: "Request-Response cycle", link: "/learn/request-response-cycle" },
      { text: "Middlewares", link: "/learn/middlewares" },
      { text: "Hooks & Events", link: "/learn/hooks-and-events" },
      { text: "Serializers", link: "/learn/serializers" },
    ],
  },
  {
    text: "Advanced",
    collapsed: true,
    items: [
      { text: "Configurations", link: "/learn/configurations" },
      { text: "Internationalization", link: "/learn/i18n" },
      { text: "Error handling", link: "/learn/error-handling" },
      {
        text: "Database transactions",
        link: "/learn/database-transactions",
      },
    ],
  },
  {
    text: "How to?",
    collapsed: true,
    items: [
      { text: "Migrate database", link: "/learn/database-migrations" },
      { text: "File uploading", link: "/learn/file-uploading" },
      { text: "Serving static files", link: "/learn/serving-static-files" },
      { text: "Authentication", link: "/learn/authentication" },
      { text: "Rate limiting", link: "/learn/rate-limiting" },
      { text: "Testing", link: "/learn/testing" },
      {
        text: "Deployment",
        link: "/learn/deployment",
      },
    ],
  },
  {
    text: "Contribution",
    collapsed: true,
    items: [
      { text: "Preparation", link: "/learn/contribution" },
      { text: "Development Kit", link: "/learn/development-kit" },
      { text: "Databases", link: "/learn/dev-kit-databases" },
      { text: "Tests", link: "/learn/contribution-tests" },
    ],
  },
];

const sidebarReference = [
  {
    text: "Configs",
    collapsed: false,
    items: [
      { text: "API configs", link: "/reference/api-configs" },
      { text: "Pino (logger) configs", link: "/reference/pino-logger-configs" },
      { text: "Rate limit configs", link: "/reference/rate-limit-configs" },
      { text: "Database configs", link: "/reference/database-configs" },
      { text: "Cache configs", link: "/reference/cache-configs" },
      { text: "Redis configs", link: "/reference/redis-configs" },
      {
        text: "Elasticsearch configs",
        link: "/reference/elastic-search-configs",
      },
      {
        text: "Search configs",
        link: "/reference/search-configs",
      },
      { text: "Version configs", link: "/reference/version-configs" },
    ],
  },
  {
    text: "Initialization",
    collapsed: true,
    items: [
      { text: "onBeforeInit()", link: "/reference/on-before-init" },
      { text: "onAfterInit()", link: "/reference/on-after-init" },
    ],
  },
  {
    text: "Axe API",
    collapsed: true,
    items: [
      { text: "App", link: "/reference/app" },
      { text: "IContext", link: "/reference/icontext" },
      { text: "AxeRequest", link: "/reference/axe-request" },
      { text: "AxeResponse", link: "/reference/axe-response" },
      { text: "IoC", link: "/reference/ioc" },
      { text: "ApiError", link: "/reference/api-error" },
      { text: "Error Codes", link: "/errors" },
    ],
  },
  {
    text: "Models",
    collapsed: true,
    items: [
      { text: "table()", link: "/reference/model-table" },
      { text: "primaryKey()", link: "/reference/model-primary-key" },
      { text: "fillable()", link: "/reference/model-fillable" },
      { text: "validations()", link: "/reference/model-validations" },
      { text: "hiddens()", link: "/reference/model-hiddens" },
      { text: "createdAtColumn()", link: "/reference/model-created-at-column" },
      { text: "updatedAtColumn()", link: "/reference/model-updated-at-column" },
      { text: "deletedAtColumn()", link: "/reference/model-deleted-at-column" },
      { text: "handlers()", link: "/reference/model-handlers" },
      { text: "middlewares()", link: "/reference/model-middlewares" },
      { text: "transactions()", link: "/reference/model-transactions" },
      { text: "limits()", link: "/reference/model-limits" },
      { text: "cache()", link: "/reference/model-cache" },
      { text: "search()", link: "/reference/model-search" },
      { text: "getSearchQuery()", link: "/reference/model-get-search-query" },
      { text: "ignore()", link: "/reference/model-ignore" },
    ],
  },
  {
    text: "Handlers",
    collapsed: true,
    items: [
      { text: "Defaults", link: "/reference/default-handlers" },
      { text: "INSERT", link: "/reference/handlers-insert-handler" },
      { text: "PAGINATE", link: "/reference/handlers-paginate-handler" },
      { text: "SHOW", link: "/reference/handlers-show-handler" },
      { text: "UPDATE", link: "/reference/handlers-update-handler" },
      { text: "DELETE", link: "/reference/handlers-delete-handler" },
      {
        text: "FORCE_DELETE",
        link: "/reference/handlers-force-delete-handler",
      },
      { text: "PATCH", link: "/reference/handlers-patch-handler" },
      { text: "ALL", link: "/reference/handlers-all-handler" },
      { text: "SEARCH", link: "/reference/handlers-search-handler" },
    ],
  },
  {
    text: "Queries",
    collapsed: true,
    items: [
      { text: "fields", link: "/reference/queries-fields" },
      { text: "sort", link: "/reference/queries-sort" },
      { text: "page", link: "/reference/queries-page" },
      { text: "per_page", link: "/reference/queries-per-page" },
      { text: "trashed", link: "/reference/queries-trashed" },
      { text: "q", link: "/reference/queries-q" },
      { text: "with", link: "/reference/queries-with" },
    ],
  },
  {
    text: "Hooks & Events",
    collapsed: true,
    items: [
      {
        text: "onBeforeInsert()",
        link: "/reference/hooks-events-on-before-insert",
      },
      {
        text: "onBeforeUpdateQuery()",
        link: "/reference/hooks-events-on-before-update-query",
      },
      {
        text: "onBeforeUpdate()",
        link: "/reference/hooks-events-on-before-update",
      },
      {
        text: "onBeforeDeleteQuery()",
        link: "/reference/hooks-events-on-before-delete-query",
      },
      {
        text: "onBeforeDelete()",
        link: "/reference/hooks-events-on-before-delete",
      },
      {
        text: "onBeforeForceDeleteQuery()",
        link: "/reference/hooks-events-on-before-force-delete-query",
      },
      {
        text: "onBeforeForceDelete()",
        link: "/reference/hooks-events-on-before-force-delete",
      },
      {
        text: "onBeforePaginate()",
        link: "/reference/hooks-events-on-before-paginate",
      },
      { text: "onBeforeAll()", link: "/reference/hooks-events-on-before-all" },
      {
        text: "onBeforeShow()",
        link: "/reference/hooks-events-on-before-show",
      },
      {
        text: "onAfterInsert()",
        link: "/reference/hooks-events-on-after-insert",
      },
      {
        text: "onAfterUpdateQuery()",
        link: "/reference/hooks-events-on-after-update-query",
      },
      {
        text: "onAfterUpdate()",
        link: "/reference/hooks-events-on-after-update",
      },
      {
        text: "onAfterDeleteQuery()",
        link: "/reference/hooks-events-on-after-delete-query",
      },
      {
        text: "onAfterDelete()",
        link: "/reference/hooks-events-on-after-delete",
      },
      {
        text: "onAfterForceDeleteQuery()",
        link: "/reference/hooks-events-on-after-force-delete-query",
      },
      {
        text: "onAfterForceDelete()",
        link: "/reference/hooks-events-on-after-force-delete",
      },
      {
        text: "onAfterPaginate()",
        link: "/reference/hooks-events-on-after-paginate",
      },
      { text: "onAfterAll()", link: "/reference/hooks-events-on-after-all" },
      { text: "onAfterShow()", link: "/reference/hooks-events-on-after-show" },
    ],
  },
  {
    text: "Axe API Client",
    collapsed: true,
    items: [
      { text: "setConfig()", link: "/reference/client-set-config" },
      { text: "addRequest()", link: "/reference/client-add-request" },
      { text: "addResponse()", link: "/reference/client-add-response" },
      { text: "first()", link: "/reference/client-first" },
      { text: "resource()", link: "/reference/client-resource" },
      { text: "insert()", link: "/reference/client-insert" },
      { text: "update()", link: "/reference/client-update" },
      { text: "patch()", link: "/reference/client-patch" },
      { text: "delete()", link: "/reference/client-delete" },
      { text: "paginate()", link: "/reference/client-paginate" },
      { text: "with()", link: "/reference/client-with" },
      { text: "where()", link: "/reference/client-where" },
      { text: "orWhere()", link: "/reference/client-or-where" },
      { text: "andWhere()", link: "/reference/client-and-where" },
      { text: "whereLike()", link: "/reference/client-where-like" },
      { text: "whereIn()", link: "/reference/client-where-in" },
      { text: "whereBetween()", link: "/reference/client-where-between" },
      { text: "whereNull()", link: "/reference/client-where-null" },
    ],
  },
];

const upgradeReference = [
  { text: "Versioning Policy", link: "/upgrading/versioning-policy" },
  { text: "Upgrading to v1", link: "/upgrading/v1" },
  { text: "Upgrading to 0.30.0", link: "/upgrading/0.30.0.html" },
  { text: "Upgrading to 0.20.0", link: "/upgrading/0.20.0.html" },
];

const ecosystemReference = [
  {
    text: "Support",
    link: "/ecosystem/support",
  },
  {
    text: "FAQ",
    link: "/ecosystem/faq",
  },
  {
    text: "Team",
    link: "/ecosystem/team",
  },
  { text: "CLI", link: "https://github.com/axe-api/axe-magic" },
  {
    text: "SonarCloud",
    link: "https://sonarcloud.io/dashboard?id=axe-api_axe-api",
  },
];

export default defineConfig({
  title: "Axe API",
  description:
    "The fastest way to create Rest API, by defining database models and relations.",

  lang: "en-US",

  lastUpdated: false,

  themeConfig: {
    logo: "/axe.png",

    editLink: {
      pattern: "https://github.com/axe-api/docs/edit/master/docs/:path",
      text: "Edit this page on GitHub",
    },

    nav: [
      {
        text: "Learn",
        link: "/learn/quick-start",
      },
      {
        text: "API Reference",
        link: "/reference/api-configs",
      },
      {
        text: "Blog",
        link: "/blog/index",
      },
      {
        text: "Upgrading",
        items: [
          {
            text: "Versioning Policy",
            link: "/upgrading/versioning-policy",
          },
          { text: "v1 (stable)", link: "/upgrading/v1" },
          { text: "v0.30", link: "/upgrading/0.30.0.html" },
          { text: "v0.20", link: "/upgrading/0.20.0.html" },
          {
            text: "Releases",
            link: "https://github.com/axe-api/axe-api/releases",
          },
          {
            text: "Changelog",
            link: "https://github.com/axe-api/axe-api/blob/master/CHANGELOG.md",
          },
        ],
      },
      {
        text: "Ecosystem",
        items: [
          {
            text: "Support",
            link: "/ecosystem/support",
          },
          {
            text: "FAQ",
            link: "/ecosystem/faq",
          },
          {
            text: "Team",
            link: "/ecosystem/team",
          },
          { text: "CLI", link: "https://github.com/axe-api/axe-magic" },
          {
            text: "SonarCloud",
            link: "https://sonarcloud.io/dashboard?id=axe-api_axe-api",
          },
        ],
      },
      {
        text: "v1",
        items: [
          {
            text: "v1 (stable)",
            link: "https://axe-api.com",
          },
          {
            text: "v0.30",
            link: "https://legacy.axe-api.com",
          },
        ],
      },
      { text: "GitHub", link: "https://github.com/axe-api/axe-api" },
    ],

    sidebar: {
      "/learn/": sidebarGuide(),
      "/reference/": sidebarReference,
      "/errors": sidebarReference,
      "/upgrading/": upgradeReference,
      "/ecosystem/": ecosystemReference,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/axe-api/axe-api" },
      { icon: "twitter", link: "https://twitter.com/axeapi" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2020-present",
    },

    search: {
      provider: "local",
    },
  },

  head: [
    ["link", { rel: "icon", href: `/logo.png` }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["link", { rel: "stylesheet", href: "/styles.css" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.9.1/dist/cookieconsent.css",
      },
    ],
    [
      "meta",
      {
        name: "description",
        content:
          "Axe API is the next generation rest API framework. You can quickly create a Rest API by simply defining models and relationships.",
      },
    ],
    ["meta", { name: "og:title", content: "Axe API" }],
    [
      "meta",
      {
        name: "og:description",
        content:
          "Axe API is the next generation rest API framework. You can quickly create a Rest API by simply defining models and relationships.",
      },
    ],
    ["meta", { name: "og:image", content: "https://axe-api.com/social.png" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: "Axe API" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Axe API is the next generation rest API framework. You can quickly create a Rest API by simply defining models and relationships.",
      },
    ],
    [
      "meta",
      { name: "twitter:image", content: "https://axe-api.com/social.png" },
    ],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    [
      "link",
      { rel: "apple-touch-icon", href: `/icons/apple-touch-icon-152x152.png` },
    ],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/icons/safari-pinned-tab.svg",
        color: "#3eaf7c",
      },
    ],
    [
      "meta",
      {
        name: "msapplication-TileImage",
        content: "/icons/msapplication-icon-144x144.png",
      },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
    [
      "script",
      {
        defer: true,
        src: "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.9.1/dist/cookieconsent.js",
      },
    ],
    [
      "script",
      {
        defer: true,
        src: "/init.js",
      },
    ],
    [
      "script",
      {
        async: true,
        type: "text/plain",
        "data-cookiecategory": "analytics",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1HBM031QWE",
      },
    ],
    [
      "script",
      {
        type: "text/plain",
        "data-cookiecategory": "analytics",
      },
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1HBM031QWE');
      `,
    ],
    // [
    //   "script",
    //   {},
    //   `
    //   (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    // .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    // n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    // (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    // ml('account', '418678');
    //   `,
    // ],
  ],

  transformHtml: (_, id, { pageData }) => {
    const file = fs.statSync(path.join(__dirname, "..", pageData.relativePath));
    if (!/[\\/]404\.html$/.test(id)) {
      const url = pageData.relativePath.replace(/((^|\/)index)?\.md$/, "$2");
      links.push({
        // you might need to change this if not using clean urls mode
        url: url.length > 0 ? `${url}.html` : url,
        lastmod: file.mtime,
      });
    }
  },

  buildEnd: ({ outDir }) => {
    // console.log(links)
    const sitemap = new SitemapStream({
      hostname: "https://axe-api.com/",
    });
    const writeStream = createWriteStream(resolve(outDir, "sitemap.xml"));
    sitemap.pipe(writeStream);
    links.forEach((link) => sitemap.write(link));
    sitemap.end();
  },
});
