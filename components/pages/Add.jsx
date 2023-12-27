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
  IonBackButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, set } from '../../data/IonicStorage';
import { useHistory, useLocation, useParams } from 'react-router';


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

  useIonViewDidEnter(async () => {
    if (!productId || (productData && productData.id)) {
      return;
    }
    const products = await get('products');
    const product = products.find(el => el.id === +productId);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
  });

  useEffect(() => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [file])

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
    const products = (await get('products')) || [];
    if (productId) {
      const index = products.findIndex(el => el.id === +productId);
      if (index === -1) {
        return;
      }
      products[index] = product;
      await set('products', products);

      //I tried a lot of stuff here like passing product to location state, weird lifecycle hooks,
      //force rerendering the product component, passing setters from the product details and setting it here.
      //Local storage was the only solution that worked for me.
      localStorage.setItem('product', JSON.stringify(product));
      history.push("/tabs/shop/" + product.id, product);
    } else {
      products.push(product);
      await set('products', products);
      history.push("/tabs/shop/" + product.id, product);
      resetState();
    }
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
