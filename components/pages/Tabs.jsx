import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addCircle, list, qrCode } from 'ionicons/icons';

import Home from './Shop';
import Add from './Add';
import ProductDetail from './Product';
import Scan from './Scan';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/shop" render={() => <Home />} exact={true} />
        <Route path="/tabs/add" render={() => <Add />} exact={true} />
        <Route path="/tabs/shop/:productId" render={() => <ProductDetail />} exact={true} />
        <Route path="/tabs/qr" render={() => <Scan />} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/shop" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/add">
          <IonIcon icon={addCircle} />
          <IonLabel>Add product</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/shop">
          <IonIcon icon={list} />
          <IonLabel>Shop</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/qr">
          <IonIcon icon={qrCode} />
          <IonLabel>Scan QR</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
