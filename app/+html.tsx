import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';
import { colors } from '@/constants/theme';

export default function Html({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
        <meta content={colors.background} name="theme-color" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                margin: 0;
                max-width: 100%;
                overflow-x: hidden;
                overscroll-behavior-x: none;
                padding: 0;
                width: 100%;
              }

              #root {
                max-width: 100%;
                overflow-x: hidden;
                width: 100%;
              }

              *, *::before, *::after {
                box-sizing: border-box;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
