import {
  IonPage,
  IonHeader,
  IonItem,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonToggle,
  IonLabel,
  useIonViewDidEnter,
} from '@ionic/react';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';

import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setSettings } from '../../store/actions';

const Scan = () => {

  useIonViewDidEnter(scanSingleBarcode);

  async function scanSingleBarcode() {
    return new Promise(async resolve => {
      document.querySelector('body')?.classList.add('barcode-scanner-active');
  
      const listener = await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          await listener.remove();
          document
            .querySelector('body')
            ?.classList.remove('barcode-scanner-active');
          await BarcodeScanner.stopScan();
          resolve(result.barcode);
        },
      );
  
      await BarcodeScanner.startScan();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan QR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Scan;
