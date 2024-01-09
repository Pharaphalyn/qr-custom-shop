import { image as imageIcon, logoUsd, save } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonImg,
  useIonViewDidEnter,
  IonButtons,
  IonBackButton,
  useIonLoading,
  useIonToast
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { config } from '../../config';
import imageCompression from 'browser-image-compression';


const Add = () => {
  const productData = useLocation().state || {};
  const params = useParams();
  const { productId } = params;
  const [inputElement, setInputElement] = useState();
  const [file, setFile] = useState();
  const [image, setImage] = useState(productData.image);
  const [name, setName] = useState(productData.name);
  const [price, setPrice] = useState(productData.price);
  const [description, setDescription] = useState(productData.description);
  const history = useHistory();
  const [present, dismiss] = useIonLoading();
  const [toast] = useIonToast();

  useIonViewDidEnter(async () => {
    if (!productId || (productData && productData.id)) {
      return;
    }
    present({
      spinner: 'circles',
      cssClass: 'qr-loading'
    });
    const product = (await (await fetch(config.PRODUCT_API + '?id=' + productId || productData.id)).json())?.product;
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setTimeout(dismiss, 150);
  });

  useEffect(() => {
    async function processImage(file) {
      const imageFile = await imageCompression.getFilefromDataUrl(file);;
  
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      try {
        const compressedFile = await imageCompression(imageFile, options);
        const imageData = await imageCompression.getDataUrlFromFile(compressedFile);
        setImage(imageData);
      } catch (error) {
        console.log(error);
        toast({
          message: 'Problems while loading the image. Please try again.',
          duration: 3000,
          position: 'bottom',
        });
      }
    }

    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      processImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [file, toast]);

  function resetState() {
    setFile(null);
    setImage(null);
    setName(null);
    setPrice(null);
    setDescription(null);
  }

  function hash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  async function saveProduct() {
    const product = {
      id: +productId || hash(new Date() + name + price + description),
      name,
      price,
      description,
      image
    };
    if (productId) {
      const index = products.findIndex(el => el.id === +productId);
      present({
        spinner: 'circles',
        cssClass: 'qr-loading'
      });
      if (index === -1) {
        return;
      }
      await fetch(config.PRODUCT_API, {method: 'PUT', body: JSON.stringify({ product }),
        headers: new Headers({"Content-Type": "application/json", Accept: 'application/json'})});

      //I tried a lot of stuff here like passing product to location state, weird lifecycle hooks,
      //force rerendering the product component, passing setters from the product details and setting it here.
      //Local storage was the only solution that worked for me.
      localStorage.setItem('product', JSON.stringify(product));
      history.push("/tabs/shop/" + product.id, product);
    } else {
      present({
        spinner: 'circles',
        cssClass: 'qr-loading'
      });
      await fetch(config.PRODUCT_API, {method: 'POST', body: JSON.stringify({ product }),
        headers: new Headers({"Content-Type": "application/json", Accept: 'application/json'})});
      history.push("/tabs/shop/" + product.id, product);
      resetState();
    }
    setTimeout(dismiss, 150);
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          {productId && <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/shop" />
          </IonButtons>}
          <IonTitle>Add product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add product</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="p-5">
          <IonItem>
            <IonInput label="Name" labelPlacement="floating" value={name} onIonInput={(e) => setName(e.target.value)} placeholder="Product name"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput label="Price" labelPlacement="floating" value={price} onIonInput={(e) => setPrice(e.target.value)} type="number" placeholder="Price"></IonInput>
            <IonIcon slot="end" icon={logoUsd}></IonIcon>
          </IonItem>
          <IonItem>
            <IonTextarea label="Description" labelPlacement="floating" value={description} onIonInput={(e) => setDescription(e.target.value)} rows={5} placeholder="Description"/>
          </IonItem>
          <div className="flex justify-center flex-col mt-5">
            <IonButton onClick={() => inputElement.click()}>
              <input
                accept="image/*"
                hidden
                ref={input => (input !== null ? setInputElement(input) : null)}
                type="file"
                onChange={e =>
                  setFile(
                    e.nativeEvent.target.files?.[0] || {}
                  )
                }
              />
              <IonIcon slot="start" icon={imageIcon} />
              Choose Image
            </IonButton>
            {image && <div className="flex justify-center max-h-80 max-w-full m-5"><IonImg src={image} alt="Image Preview"/></div>}
            <IonButton onClick={saveProduct}>
              <IonIcon slot="start" icon={save} />
              Save
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Add;
