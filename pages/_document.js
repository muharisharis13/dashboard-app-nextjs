// ./pages/_document.js
import Document, { Head, Main, NextScript, Html } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    return (
      <Html
        lang="en"
        className="light-style layout-menu-fixed"
        dir="ltr"
        data-theme="theme-default"
        data-assets-path="/assets/"
        data-template="vertical-menu-template-free"
      >
        <Head>
          {/* <!-- Favicon --> */}
          <link
            rel="icon"
            type="image/x-icon"
            href="/assets/img/favicon/favicon.ico"
          />

          {/* <!-- Fonts --> */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />

          {/* <!-- Icons. Uncomment required icon fonts --> */}
          <link rel="stylesheet" href="/assets/vendor/fonts/boxicons.css" />

          {/* <!-- Core CSS --> */}
          <link
            rel="stylesheet"
            href="/assets/vendor/css/core.css"
            className="template-customizer-core-css"
          />
          <link
            rel="stylesheet"
            href="/assets/vendor/css/theme-default.css"
            className="template-customizer-theme-css"
          />
          <link rel="stylesheet" href="/assets/css/demo.css" />

          {/* <!-- Vendors CSS --> */}
          <link
            rel="stylesheet"
            href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"
          />

          <link
            rel="stylesheet"
            href="/assets/vendor/libs/apex-charts/apex-charts.css"
          />

          {/* <!-- Page CSS --> */}

          {/* <!-- Favicon --> */}
          <link
            rel="icon"
            type="image/x-icon"
            href="/assets/img/favicon/favicon.ico"
          />

          {/* <!-- Fonts --> */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />

          {/* <!-- Icons. Uncomment required icon fonts --> */}
          <link rel="stylesheet" href="/assets/vendor/fonts/boxicons.css" />

          {/* <!-- Core CSS --> */}
          <link
            rel="stylesheet"
            href="/assets/vendor/css/core.css"
            class="template-customizer-core-css"
          />
          <link
            rel="stylesheet"
            href="/assets/vendor/css/theme-default.css"
            class="template-customizer-theme-css"
          />
          <link rel="stylesheet" href="/assets/css/demo.css" />

          {/* <!-- Vendors CSS --> */}
          <link
            rel="stylesheet"
            href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css"
          />

          {/* <!-- Page CSS --> */}
          {/* <!-- Page --> */}
          <link
            rel="stylesheet"
            href="/assets/vendor/css/pages/page-auth.css"
          />

          <script async src="/assets/vendor/js/helpers.js"></script>
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
