const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(function getFullName() {
  let fullName = '';

  if (this.first_name && this.family_name) {
    fullName = `${this.family_name}, ${this.first_name}`;
  }

  return fullName;
});

AuthorSchema.virtual('lifespan').get(function getLifespan() {
  const birth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : '...';

  const death = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : '...';

  return `${birth} – ${death}`;
});

AuthorSchema.virtual('date_of_birth_iso').get(function getDateOfBirthISO() {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toISODate()
    : null;
});

AuthorSchema.virtual('date_of_death_iso').get(function getDateOfDeathISO() {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toISODate()
    : null;
});

AuthorSchema.virtual('url').get(function getUrl() {
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);
