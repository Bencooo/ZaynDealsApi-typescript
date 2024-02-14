import express from 'express';
import * as functions from 'firebase-functions';
import http from 'http';
import userRoutes from './users/routes/userRoutes';
import merchantRoutes from './merchants/routes/merchantRoutes';
import couponRoutes from './coupons/routes/couponRoutes';
import usedCouponRoutes from './usedCoupons/routes/usedCouponRoutes';
import subscriptionRoutes from './subscriptions/routes/subscriptionRoutes';
import userSubscriptionRoutes from './userSubscriptions/routes/userSubscriptionRoutes';


const app = express();
app.use(express.json());


app.use('/users', userRoutes);
app.use('/merchants', merchantRoutes);
app.use('/coupons', couponRoutes);
app.use('/usedCoupons', usedCouponRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/userSubscriptions', userSubscriptionRoutes);
  
  const server = http.createServer(app);

  server.listen(4000, () => {
    console.log('Server running on http://localhost:4000/');
  });


exports.api = functions.https.onRequest(app);

  



