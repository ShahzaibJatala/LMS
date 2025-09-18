import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

const PaymentForm = ({ courseId, price, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await axios.post(
        `${serverUrl}/api/payment/create-payment-intent`,
        { courseId, amount: price * 100 },
        { withCredentials: true }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstname} ${formData.lastname}`,
              email: formData.email,
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Update course access
        await axios.post(
          `${serverUrl}/api/payment/paymentLacture/${courseId}`,
          {amount: price * 100, currency: 'usd' },
          { withCredentials: true }
        );
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <CardElement className="p-3 border rounded" />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !stripe}
          className={`flex-1 py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Processing..." : `Pay $${price}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;