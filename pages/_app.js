import Layout from "../components/layout";
import Script from "next/script";
import ReactHookFormProvider from "../useformContext/index";
import { Loading } from "../components";
function MyApp({ Component, pageProps }) {
  return (
    <ReactHookFormProvider>
      <Script
        async
        type="text/javascript"
        src="/assets/vendor/js/helpers.js"
      ></Script>
      <Script async type="text/javascript" src="/assets/js/config.js"></Script>
      <Script
        async
        type="text/javascript"
        src="/assets/vendor/libs/jquery/jquery.js"
      ></Script>
      <Script
        async
        type="text/javascript"
        src="/assets/vendor/libs/popper/popper.js"
      ></Script>
      <Script
        async
        type="text/javascript"
        src="/assets/vendor/js/bootstrap.js"
      ></Script>
      <Script
        async
        type="text/javascript"
        src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"
      ></Script>

      <Script
        async
        type="text/javascript"
        src="/assets/vendor/js/menu.js"
      ></Script>
      <Script
        async
        type="text/javascript"
        src="/assets/js/dashboards-analytics.js"
      ></Script>

      <Script
        async
        type="text/javascript"
        src="/assets/vendor/libs/apex-charts/apexcharts.js"
      ></Script>

      <Script async type="text/javascript" src="/assets/js/main.js"></Script>
      <Loading />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReactHookFormProvider>
  );
}

export default MyApp;
