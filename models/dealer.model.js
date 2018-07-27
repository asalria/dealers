const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const dealerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    phoneaux: {
        type: String,
        required: [true, 'Phone aux is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    emailapp: {
        type: String,
        required: [true, 'Email for appointments is required']
    },
    type: {
        type: String,
        enum : ['VULCO', 'SOLEDAD','CONCESIONARIO','ATESA','DONTYRE','ATHLON','OTROS'],
        default : 'VULCO',
        required: true
    },
    hours: {
        type: String,
        required: [true, 'Dealer hours is required']
    },
    hoursweekend: {
        type: String,
        required: [true, 'Dealer weekend hours is required']
    },
    contact: {
        type: String,
        required: [true, 'Contact person info is required']
    },
    unit: {
        type: String,
        enum: ['YES','NO']
    },
    delivery: {
        type: String,
        enum: ['YES','NO']
    },
    fast: {
        type: String,
        enum: ['YES','NO']
    },
    custody: {
        type: String,
        enum: ['YES', 'NO']
    },
    atesa: {
        type: String,
        enum: ['YES','NO']
    },
    athlon: {
        type: String,
        enum: ['YES','NO']
    },
    leaseplan: {
        type: String,
        enum: ['YES', 'NO']
    },
    img: {
        type: String
    },
    comments: {
        type: String
    },
    startPoint: {
        type: Object,
        properties: {
          type: {
            type: String,
            enum: 'Point',
            default: 'Point'
          },
          coordinates: {
            type: [Number],
            default: [0, 0]
          }
        }
   }},{ timestamps: true });


dealerSchema.index({startPoint:"2dsphere"});

dealerSchema.pre('save', function save(next) {
    console.log(this.startPoint);
    const dealer = this;
    dealer.startPoint = {
        type: "Point",
        coordinates: this.startPoint
    };
    
    dealer.img = "https://maps.googleapis.com/maps/api/staticmap?center=" + dealer.startPoint.coordinates[0] + "," + dealer.startPoint.coordinates[1] +
    "&markers=color:red%7Clabel:C%7C"+ dealer.startPoint.coordinates[0] + "," + dealer.startPoint.coordinates[1]+"&size=600x300&zoom=15&key=" + process.env.GOOGLE_MAPS_API_IMG;
    return next();
  });


const Dealer = mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;