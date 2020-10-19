import React, { useRef, useImperativeHandle } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { useTheme, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import { Field, Formik, Form } from "formik";
import { TextField, fieldToTextField } from "formik-material-ui";
import { connect, getIn } from "formik";
import { TextField as MuiTextField } from "@material-ui/core";

const theme = createMuiTheme({});

const StripeInput2 = ({ component: Component, inputRef, ...props }) => {
  const elementRef = useRef();
  useImperativeHandle(inputRef, () => ({
    focus: () => elementRef.current.focus,
  }));
  return (
    <Component
      onReady={(element) => (elementRef.current = element)}
      {...props}
    />
  );
};

const StripeInput = ({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting, touched, errors },
  onBlur,
  helperText,
  ...props
}) => {
  const {
    component: Component,
    inputRef,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribeBy,
    defaultValue,
    required,
    onKeyDown,
    onKeyUp,
    readOnly,
    autoComplete,
    autoFocus,
    type,
    name,
    rows,
    options,
    ...other
  } = props;
  const theme = useTheme();
  const [mountNode, setMountNode] = React.useState(null);
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  React.useImperativeHandle(
    inputRef,
    () => ({
      focus: () => mountNode.focus(),
    }),
    [mountNode]
  );

  return (
    <CardNumberElement
      onReady={setMountNode}
      error={showError}
      helperText={showError ? fieldError : helperText}
      disabled={disabled ?? isSubmitting}
      onBlur={
        onBlur ??
        function (e) {
          fieldOnBlur(e ?? field.name);
        }
      }
      options={{
        ...options,
        style: {
          base: {
            color: theme.palette.text.primary,
            fontSize: `${theme.typography.fontSize}px`,
            fontFamily: theme.typography.fontFamily,
            "::placeholder": {
              color: fade(theme.palette.text.primary, 0.42),
            },
          },
          invalid: {
            color: theme.palette.text.primary,
          },
        },
      }}
      {...other}
    />
  );
};

// const FormikStripInput = connect(StripeInput);

const SplitForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });
    console.log("[PaymentMethod]", payload);
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ test: "", cardNumber: "" }}
    >
      <form>
        <br />
        <br />
        <Field
          name="test"
          label="Test"
          variant={"outlined"}
          component={TextField}
        />
        <br />

        {/* <Field
          name="cardNumber"
          label="Card Number"
          variant={"outlined"}
          component={StripeInput}
          fullWidth
          InputLabelProps={{ shrink: true }}
        /> */}

        <MuiTextField
          fullWidth
          label="Card"
          variant="outlined"
          InputProps={{
            inputComponent: StripeInput2,
            inputProps: {
              component: CardNumberElement,
              options: {
                showIcon: true,
              },
            },
          }}
          InputLabelProps={{ shrink: true }}
        />

        {/* <Field
          name="cardNumber"
          label="Card Number"
          variant={"outlined"}
          component={TextField}
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: FormikStripInput,
            options: {
              showIcon: true,
            },
            inputProps: {
              component: CardNumberElement,
              options: {
                showIcon: true,
              },
            },
          }}
        /> */}
        <label>
          {/* Card number
          <CardNumberElement
            onReady={() => {
              console.log("CardNumberElement [ready]");
            }}
            onChange={(event) => {
              console.log("CardNumberElement [change]", event);
            }}
            onBlur={() => {
              console.log("CardNumberElement [blur]");
            }}
            onFocus={() => {
              console.log("CardNumberElement [focus]");
            }}
          /> */}
        </label>
        <label>
          Expiration date
          <CardExpiryElement
            onReady={() => {
              console.log("CardNumberElement [ready]");
            }}
            onChange={(event) => {
              console.log("CardNumberElement [change]", event);
            }}
            onBlur={() => {
              console.log("CardNumberElement [blur]");
            }}
            onFocus={() => {
              console.log("CardNumberElement [focus]");
            }}
          />
        </label>
        <label>
          CVC
          <CardCvcElement
            onReady={() => {
              console.log("CardNumberElement [ready]");
            }}
            onChange={(event) => {
              console.log("CardNumberElement [change]", event);
            }}
            onBlur={() => {
              console.log("CardNumberElement [blur]");
            }}
            onFocus={() => {
              console.log("CardNumberElement [focus]");
            }}
          />
        </label>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </Formik>
  );
};

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Elements stripe={stripePromise}>
          <SplitForm />
        </Elements>
      </ThemeProvider>
    </div>
  );
}

export default App;
