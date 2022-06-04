import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="sr">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
            rel="stylesheet"
          />
          <link
            rel="icon"
            href="/vecna-logo-beocrn-150x150.png"
            sizes="32x32"
          ></link>
          <link
            rel="icon"
            href="/vecna-logo-beocrn-300x300.png"
            sizes="192x192"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
