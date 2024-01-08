import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonViewDidEnter,
  useIonViewWillLeave,
  IonButton,
  useIonLoading,
} from '@ionic/react';
import {
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { config } from '../../config';

const Scan = () => {
  const [qrValue, setQrValue] = useState();
  const [scanActive, setScanActive] = useState(true);
  const history = useHistory();
  const [present, dismiss] = useIonLoading();

  useIonViewDidEnter(() => {
    scanSingleBarcode()
      .then(qr => {
        if (qr) {
          setId(qr.rawValue);
        }
      });
  });

  useIonViewWillLeave(() => {
    stopScan();
    dismiss();
  });

  async function stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanning-active');
    return BarcodeScanner.stopScan();
  }

  async function goToProduct(id) {
    await present({
      spinner: 'circles',
      cssClass: 'qr-loading'
    });
    const product = (await (await fetch(config.PRODUCT_API + '?id=' + id)).json())?.product;
    setTimeout(dismiss, 100);
    if (product) {
      setQrValue(null);
      history.push("/tabs/shop/" + id, product);
    } else {
      setQrValue(id);
    }
    setTimeout(() => setScanActive(false));
  }

  async function scanSingleBarcode() {
    document.querySelector('body')?.classList.add('barcode-scanning-active');
    let listen = true;
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async result => {
        if (listen) {
          listen = false
        } else {
          return;
        }
        await listener.remove();
        await stopScan();
        await goToProduct(result.barcode?.rawValue);
      },
    );
    await BarcodeScanner.startScan();
    setScanActive(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan QR</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!scanActive && qrValue !== null && <div className="flex justify-center flex-col m-5">
          <div className="mb-5">The product with id &quot;<b>{qrValue}</b>&quot; does not exist. Try another QR code.</div>
          <IonButton onClick={scanSingleBarcode}>Scan again</IonButton>
        </div>}
      </IonContent>
    </IonPage>
  );
};

export default Scan;
