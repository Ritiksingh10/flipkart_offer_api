// controllers/discountController.js
import Offer from '../models/Offer.js';

function parseOfferText(text) {
  text = text.toLowerCase();

  const percentMatch = text.match(/(\d+)\s*%/);
  const cashbackMatch = text.match(/(?:cashback|save|off)[^\d₹]*₹?\s?([\d,]+)/);
  const flatMatch = text.match(/₹\s?([\d,]+)/);
  const noCost = text.includes('no cost');

  const parseValue = (str) => parseInt(str.replace(/,/g, ''));

  if (percentMatch) {
    return { type: 'percent', value: parseInt(percentMatch[1]) };
  } else if (cashbackMatch) {
    return { type: 'flat', value: parseValue(cashbackMatch[1]) };
  } else if (flatMatch) {
    return { type: 'flat', value: parseValue(flatMatch[1]) };
  } else if (noCost) {
    return { type: 'nocost', value: 0 };
  } else {
    return { type: 'unknown', value: 0 };
  }
}

function parseDescription(desc) {
  desc = desc.toLowerCase();

  const minMatch = desc.match(/min(?:imum)?(?: order)?(?: of)? ₹?(\d+)/);
  const maxMatch = desc.match(/(?:up to|max(?:imum)?) ₹?(\d+)/);

  const minOrder = minMatch ? parseInt(minMatch[1]) : 0;
  const maxDiscount = maxMatch ? parseInt(maxMatch[1]) : Infinity;

  return { minOrder, maxDiscount };
}

function calculateDiscount(amount, type, value, maxCap) {
  if (type === 'percent') {
    return Math.min((value / 100) * amount, maxCap);
  } else if (type === 'flat') {
    return Math.min(value, maxCap);
  } else {
    return 0;
  }
}

//  Main Controller
export const getHighestDiscount = async (req, res) => {
  try {
    // console.log(req.query)
    const {amountToPay, bankName, instrument}=req.query;
    const amount=amountToPay;

    if (!bankName || !amount) {
      return res.status(400).json({ message: 'amount and bankName are required.' });
    }

    const offers = await Offer.find({ bank: bankName.toLowerCase() });
    // console.log(offers)

    let bestOffer = null;
    let maxDiscount = 0;

    offers.forEach(offer => {
      
      const normalized = instrument.trim().toUpperCase();

      if (offer.paymentInstruments.includes(normalized)) {
        // console.log(`${normalized} is a valid payment instrument for this offer.`);
        const offerertext = offer.offerText || '';
        const offerdescriptiontext = offer.offerDescription || '';

        // console.log("📢 text:", offerertext);

        // console.log("📢 Description:", offerdescriptiontext);

        const parsedOffer = parseOfferText(offerertext);
        const { minOrder, maxDiscount: cap } = parseDescription(offerdescriptiontext);
        // console.log("parsedoffer: ",parsedOffer);
        // console.log("minorder: ",minOrder);
        // console.log("maxdiscount: ",maxDiscount);
        

        if (amount >= minOrder) {
          const discount = calculateDiscount(amount, parsedOffer.type, parsedOffer.value, cap);
          // console.log("discount: ",discount);

          if (discount > maxDiscount) {
            maxDiscount = discount;
            bestOffer = {
              offer,
              calculatedDiscount: discount
            };
          }
        }
      }
    });

    if (bestOffer) {
      return res.status(200).json({
        // message: "Best offer found",
        "highestDiscountAmount": bestOffer.calculatedDiscount,
        // offer: bestOffer.offer
      });
    } else {
      return res.status(404).json({ message: "No applicable offer found" });
    }
  } catch (err) {
    console.error("Error in getHighestDiscount:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
