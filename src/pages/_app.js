// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import { Provider } from "react-redux";

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

// **next-auth session provider configuration
import { SessionProvider } from "next-auth/react"

import { store } from '../redux/Store';
import { StoreProvider } from 'src/context';

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props
  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} وبسایت دریافت آنتی تحریم`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} وبسایت دریافت آنتی تحریم`}
          />
          <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          <link
            href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap"
            rel="stylesheet"
          />
        </Head>
        
    {/* <StoreProvider> */}
    <SessionProvider session={session}>          
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return <ThemeComponent settings={settings}>{getLayout(

                      <Component {...pageProps} />

                  )}</ThemeComponent>
                }}
              </SettingsConsumer>
          
            </SettingsProvider>
        </SessionProvider> 
    {/* </StoreProvider> */}

    </CacheProvider>
  )
}

export default App
