import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonViewWillEnter,
} from '@ionic/react';
import { pencil, trashBin } from 'ionicons/icons';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { get, set } from '../../data/IonicStorage';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { config } from '../../config';

const Details = ({ product, editItem, deleteItem }) => {
  return (
    <div className="p-5">
      {product.image && <div className="flex justify-center max-h-80 max-w-full mb-5">
        <IonImg src={product.image} alt="Image Preview"/>
      </div>}
      <IonItem>
        Name: {product.name}
      </IonItem>
      <IonItem>
        Price: {product.price}$
      </IonItem>
      <IonItem>
        Description: {product.description}
      </IonItem>
      <IonAccordionGroup className="mt-5">
        <IonAccordion>
          <IonItem slot="header" color="light">
            <IonLabel>QR</IonLabel>
          </IonItem>
          <div className="ion-padding flex justify-center bg-slate-50" slot="content">
            <QRCode value={'' + product.id}/>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
      <div className="flex justify-center mt-5">
        <IonButton onClick={editItem}>
          <IonIcon slot="start" icon={pencil} />
            Edit
        </IonButton>
        <IonButton color="danger" onClick={deleteItem}>
          <IonIcon slot="start" icon={trashBin} />
            Delete
        </IonButton>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const productData = useLocation().state;
  const [product, setProduct] = useState(productData);
  const params = useParams();
  const { productId } = params;
  const history = useHistory();
  const [present, dismiss] = useIonLoading();

  useIonViewWillEnter(() => {
    const setup = async () => {
      if (productData && productData.id) {
        const productStorage = localStorage.getItem('product');
        if (productStorage) {
          setProduct(JSON.parse(productStorage));
          localStorage.removeItem('product');
        }
        return;
      }
      await present({
        spinner: 'circles',
        cssClass: 'qr-loading'
      });
      const product = (await (await fetch(config.PRODUCT_API + '?id=' + productId || productData.id)).json())?.product;
      setProduct(product);
      setTimeout(dismiss, 150);
    }
    setup();
  });

  const editItem = () => {
    history.push("/tabs/shop/edit/" + product.id, product);
  };

  const deleteItem = async () => {
    await present({
      spinner: 'circles',
      cssClass: 'qr-loading'
    });
    await fetch(config.PRODUCT_API, {method: 'DELETE', body: JSON.stringify({id: product.id}),
      headers: new Headers({"Content-Type": "application/json", Accept: 'application/json'})});
    setTimeout(dismiss, 150);
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/shop" />
          </IonButtons>
          <IonTitle>Product Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {product && <Details deleteItem={deleteItem} editItem={editItem} product={product} />}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;
