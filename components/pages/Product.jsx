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
  useIonViewDidEnter,
  useIonViewWillEnter,
} from '@ionic/react';
import { pencil, trashBin } from 'ionicons/icons';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { get, set } from '../../data/IonicStorage';
import { useEffect, useReducer, useState } from 'react';
import QRCode from 'react-qr-code';

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
      const products = await get('products');
      setProduct(products.find(el => el.id === +productId));
    }
    setup();
  });

  const editItem = () => {
    history.push("/tabs/add/" + product.id, product);
  };

  const deleteItem = async () => {
    const products = await get('products');
    const index = products.findIndex(el => el.id === product.id);
    if (index === -1) {
      return;
    }
    products.splice(index, 1);
    await set('products', products);
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
