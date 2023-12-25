import { image as imageIcon, logoUsd, save } from 'ionicons/icons';
import Image from 'next/image';
import Store from '../../store';
import * as selectors from '../../store/selectors';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonInput,
  IonTextarea,
  IonButton,
  IonPicker,
  IonIcon,
  IonImg
} from '@ionic/react';
import { useEffect, useState } from 'react';

const Add = () => {
  const [inputElement, setInputElement] = useState();
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log(file);
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }, [file])

  function saveProduct() {
    const product = {
      name,
      price,
      description,
      image
    };
    console.log(product);
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
