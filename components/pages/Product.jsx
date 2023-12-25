import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { get } from '../../data/IonicStorage';
import { useState } from 'react';

const Details = ({ product }) => {
  return (
    <div className="p-5">
      <IonItem>
        Name: {product.name}
      </IonItem>
      <IonItem>
        Price: {product.price}$
      </IonItem>
      <IonItem>
        Description: {product.description}
      </IonItem>
      {product.image && <div className="flex justify-center max-h-80 max-w-full m-5"><IonImg src={product.image} alt="Image Preview"/></div>}
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const params = useParams();
  const { productId } = params;

  useIonViewDidEnter(async () => {
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
