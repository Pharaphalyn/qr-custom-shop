import Image from 'next/image';
import Card from '../ui/Card';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonMenuButton,
  useIonViewWillEnter,
  useIonLoading,
} from '@ionic/react';
import { useState } from 'react';
import { config } from '../../config';
import { Link } from 'react-router-dom';

const ShopCard = ({ name, description, price, image }) => (
  <Card className="my-4 mx-auto">
    <div className="h-64 w-full relative">
      {image && 
        <Image fill={true} className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full" src={image} alt="Image Preview" />}
    </div>
    <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{name}</h2>
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{price}$</h2>
      </div>
      <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{description}</p>
    </div>
  </Card>
);

const Shop = () => {
  const [homeItems, setHomeItems] = useState([]);
  const [present, dismiss] = useIonLoading();
  useIonViewWillEnter(() => {
    const getProducts = async () => {
      await present({
        spinner: 'circles',
        cssClass: 'qr-loading'
      });
      const products = (await (await fetch(config.PRODUCT_API)).json())?.products || [];
      // const products = (await get('products')) || [];
      setHomeItems(products);
      setTimeout(dismiss, 100);
    };
    getProducts();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR Shop</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Shop</IonTitle>
          </IonToolbar>
        </IonHeader>
        {homeItems.map((el, index) => (
          <Link key={index} to={{pathname: "/tabs/shop/" + el.id, state: el}}>
            <ShopCard {...el} />
          </Link>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Shop;
