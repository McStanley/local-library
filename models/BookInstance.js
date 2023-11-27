const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual('due_back_formatted').get(
  function getDueBackFormatted() {
    return this.due_back
      ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
      : null;
  },
);

BookInstanceSchema.virtual('due_back_iso').get(function getDueBackISO() {
  return this.due_back ? DateTime.fromJSDate(this.due_back).toISODate() : null;
});

BookInstanceSchema.virtual('url').get(function getUrl() {
  return `/catalog/book-instance/${this._id}`;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
