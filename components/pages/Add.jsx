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
  IonImg
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, set } from '../../data/IonicStorage';
import { useHistory } from 'react-router';


const Add = () => {
  const [inputElement, setInputElement] = useState();
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState('');
  const history = useHistory();

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
      id: hash(new Date() + name + price + description),
      name,
      price,
      description,
      image
    };
    const products = (await get('products')) || [];
    products.push(product);
    set('products', products);
    history.push("/tabs/shop/" + product.id, product);
  }

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
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
            <IonInput value={name} onIonInput={(e) => setName(e.target.value)} placeholder="Product name"></IonInput>
          </IonItem>
          <IonItem>
            <IonInput value={price} onIonInput={(e) => setPrice(e.target.value)} type="number" placeholder="Price"></IonInput>
            <IonIcon slot="end" icon={logoUsd}></IonIcon>
          </IonItem>
          <IonItem>
            <IonTextarea value={description} onIonInput={(e) => setDescription(e.target.value)} rows={5} placeholder="Description"/>
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
