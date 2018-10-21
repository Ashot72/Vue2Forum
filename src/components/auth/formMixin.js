export const formMixin = {
  computed: {
    emailState () {
      const { email: { $dirty, $error } } = this.$v.form
      return !$dirty ? null : !$error
    },
    invalidEmailFeedback () {
      const { email: { required, email, unique, $model } } = this.$v.form

      if (!required) {
        return 'Email is required'
      } else if (!email) {
        return 'Please enter a valid Email'
      } else if (unique !== undefined && !unique) {
        return `Email '${$model}' is taken`
      }
    },
    passwordState () {
      const { password: { $dirty, $error } } = this.$v.form
      return !$dirty ? null : !$error
    },
    invalidPasswordFeedback () {
      const { password: { required, minLen } } = this.$v.form

      if (!required) {
        return 'Password is required'
      } else if (!minLen) {
        return 'Password must be at least 6 characters in length'
      }
    }
  }
}
