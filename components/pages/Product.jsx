import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from '@ionic/react';
import { useLocation, useParams } from 'react-router-dom';
import { get } from '../../data/IonicStorage';
import { useState } from 'react';
import QRCode from 'react-qr-code';

const Details = ({ product }) => {
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
    </div>
  );
};

const ProductDetail = () => {
  const productData = useLocation().state;
  const [product, setProduct] = useState(productData);
  const params = useParams();
  const { productId } = params;

  useIonViewDidEnter(async () => {
    if (productData && productData.id) {
      return;
    }
    const products = await get('products');
    setProduct(products.find(el => el.id === +productId));
  });

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
        {product && <Details product={product} />}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail;
