// Stripe configuration
const stripePublicKey = 'pk_test_51RTPaG4ggWvPhLe5WZqHiYHlpdyMqT4NflNrhAJmLm5idzNcbed64TngGVgKTTf4cQPb1drWlJ3Z6bKUAkDo3NsY002AbpXDyB';
const stripe = Stripe(stripePublicKey);

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling
const style = {
    base: {
        color: '#32325d',
        fontFamily: '"Montserrat", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element
const card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` div
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('card-element')) {
        card.mount('#card-element');
    }
});

// Handle form submission
async function handlePayment(amount) {
    try {
        // Primero, obtenemos el PaymentIntent del servidor
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(amount), // Stripe requiere el monto en centavos
                currency: 'usd'
            })
        });

        if (!response.ok) {
            throw new Error('Error al crear el PaymentIntent');
        }

        const { clientSecret } = await response.json();

        // Confirmar el pago con Stripe
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    // Aquí puedes agregar los detalles de facturación si los tienes
                }
            }
        });

        if (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            return false;
        }

        if (paymentIntent.status === 'succeeded') {
            // El pago fue exitoso
            return paymentIntent.id;
        } else {
            throw new Error('El pago no fue completado');
        }
    } catch (e) {
        console.error('Error:', e);
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = 'Hubo un error al procesar el pago. Por favor, intente nuevamente.';
        return false;
    }
}

// Export functions and objects
window.stripeHandler = {
    handlePayment,
    card
}; 