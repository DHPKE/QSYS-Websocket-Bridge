export default {
  theme: 'vueform',
  apiKey: null, // Add your Vueform license key if you have one
  elements: [
    'text',
    'email',
    'password',
    'number',
    'select',
    'checkbox',
    'toggle',
    'slider',
    'textarea',
    'button',
    'submit'
  ],
  rules: {
    required: 'This field is required',
    email: 'Please provide a valid email address',
    min: 'Must be at least {min} characters',
    max: 'Must not exceed {max} characters'
  }
}
