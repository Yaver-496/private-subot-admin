import { IData } from './../types';
import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import useGetDataFromServer from './useGetDataFromServer';
import { useQuery } from '@tanstack/react-query';
import { getMockData } from './mockDataMaker';



export function useTelegramWebApp() {
  const [isReady, setIsReady] = useState(false);
  const [telegramUserID, setTelegramUserID] = useState<number>(0);
  const [mockData, setMockdata] = useState<IData>();

  const { isPending, error, data} = useQuery({
      queryKey: ['getData'],
      queryFn: async () => await useGetDataFromServer(telegramUserID),
  });

  useEffect(() => 
  {
    if(mockData === undefined){
      const _mockData = getMockData();
      setMockdata(_mockData);
    }
  }, []);

  useEffect(() => 
  {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();

    setIsReady(true);

    if(!isNotAvailablePlatform(WebApp.platform))
    {
        setTelegramUserID(WebApp.initDataUnsafe.user?.id!!);
    }

   /* if (!isReady) {

      WebApp.BiometricManager.init(() => 
      {
          if (!WebApp.BiometricManager.isBiometricAvailable) 
          {
              WebApp.showAlert("Biometric is not Available in this Device!");
              WebApp.close();
              return;
          }

          if(!WebApp.BiometricManager.isAccessGranted)
          {
              WebApp.BiometricManager.requestAccess({ reason: 'Biometric Manager Required to use app safely.'}, (isAccessGranted) => {
                  if(isAccessGranted) {
                      Authenticate();
                  }
              });

              if(!WebApp.BiometricManager.isAccessRequested) { return; }

              WebApp.showAlert('Enable Biometric and Reopen the App');
              WebApp.close();
          }
          else
          {
              if(!WebApp.BiometricManager.isBiometricTokenSaved){
                  Authenticate();
                  return;
              }
              else
              {
                  setIsReady(true);
              }
          }

        function Authenticate() {
          WebApp.BiometricManager.authenticate({ reason: 'Admin Required' }, (isAuthenticated) => {

            if(isAuthenticated)
            {
                setIsReady(true);
            }
            else
            {
                WebApp.showAlert('Authentication Error!');
                WebApp.close();
            }
          });
        }
      });
    }*/


    // Set theme colors
    const isDark = WebApp.colorScheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    // Set main button color to match Telegram theme
    WebApp.MainButton.setParams({
      color: WebApp.themeParams.button_color,
      text_color: WebApp.themeParams.button_text_color
    });
  }, []);

  return {
    isDataPending: isPending,
    dataError: error,
    isReady,
    webApp: WebApp,
    user: WebApp.initDataUnsafe?.user,
    themeParams: WebApp.themeParams,
    colorScheme: WebApp.colorScheme,
    userData: data ? data : mockData!!
  };
}

export function isNotAvailablePlatform(platform) 
{ 
    const currentPlatform = platform;
    return (currentPlatform === 'tdesktop') || (currentPlatform === 'weba') || (currentPlatform === 'webk') || (currentPlatform === 'unigram') || (currentPlatform === 'unknown'); 
}
