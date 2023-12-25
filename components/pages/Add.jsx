import { image, logoUsd, save } from 'ionicons/icons';
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

// const ListEntry = ({ list, ...props }) => (
//   <IonItem routerLink={`/tabs/shop/${list.id}`} className="list-entry">
//     <IonLabel>{list.name}</IonLabel>
//   </IonItem>
// );

// const AllLists = ({ onSelect }) => {
//   const lists = Store.useState(selectors.getLists);

//   return (
//     <>
//       {lists.map((list, i) => (
//         <ListEntry list={list} key={i} />
//       ))}
//     </>
//   );
// };

const Add = () => {
  const [inputElement, setInputElement] = useState();
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();
  useEffect(() => {
    console.log(file);
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      // The file's text will be printed here
      setFileData(event.target.result);
      console.log(event.target.result);
    };
    reader.readAsDataURL(file);
    // setFileData(url);
  }, [file])
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
          <IonInput placeholder="Product name"></IonInput>
          <IonItem lines="none" className='ion-no-padding'>
            <IonInput type="number" placeholder="Price"></IonInput>
            <IonIcon slot="end" icon={logoUsd}></IonIcon>
          </IonItem>
          <IonTextarea rows={5} placeholder="Description"></IonTextarea>
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
              <IonIcon slot="start" icon={image} />
              Choose Image
            </IonButton>
            {fileData && <div className="flex justify-center max-h-80 max-w-full m-5"><IonImg src={fileData} alt="Image Preview"/></div>}
            <IonButton onClick={()=>console.log(file)}>
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
