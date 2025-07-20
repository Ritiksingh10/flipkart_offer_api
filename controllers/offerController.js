import Offer from '../models/Offer.js';

function extractPaymentInstruments(text1, text2) {
  const combined = `${text1} ${text2}`.toLowerCase();
  const instruments = new Set();

  // Detect "no emi" or "without emi" before adding EMI_OPTIONS
  const hasEMI = /(?:\bemi\b)/.test(combined);
  const isNegativeEMI = /\b(no emi|without emi|non-emi|not available on emi)\b/.test(combined);

  if (hasEMI && !isNegativeEMI) instruments.add("EMI_OPTIONS");

  if (/credit/.test(combined)) instruments.add("CREDIT");
  if (/debit/.test(combined)) instruments.add("DEBIT");
  if (/upi/.test(combined)) instruments.add("UPI");
  if (/netbanking|net banking/.test(combined)) instruments.add("NETBANKING");

  if (instruments.size === 0) instruments.add("OTHERS");

  return Array.from(instruments);
}

export const createOffers = async (req, res) => {
  try {
    const payload = req.body.flipkartOfferApiResponse;
    const items = payload?.paymentOptions?.items;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Missing or invalid 'paymentOptions.items'" });
    }

    const offerListItem = items.find(item => item.type === "OFFER_LIST");
    if (!offerListItem) {
      return res.status(400).json({ message: "No item with type 'OFFER_LIST' found." });
    }

    const offerList = offerListItem?.data?.offers?.offerList;
    if (!Array.isArray(offerList)) {
      return res.status(400).json({ message: "Invalid or missing 'offerList'" });
    }

    const filteredOffers = [];

    for (const offer of offerList) {
      const bank = offer.provider?.[0]?offer.provider[0].toLowerCase().trim(): "unknown";
      const offerText = offer.offerText?.text?.toLowerCase().trim() || "";
      const offerDescription = offer.offerDescription?.text?.toLowerCase().trim() || "";

      if (!bank || !offerText || !offerDescription) continue;

      const exists = await Offer.findOne({ bank, offerText, offerDescription });
      if (!exists) {
        const paymentInstruments = extractPaymentInstruments(offerText, offerDescription);

        filteredOffers.push({
          bank,
          offerText,
          offerDescription,
          paymentInstruments,
        });
      }
    }

    if (filteredOffers.length > 0) {
      await Offer.insertMany(filteredOffers);
    }

    res.status(201).json({
      "noOfOffersIdentified": offerList.length,
      "noOfNewOffersCreated": filteredOffers.length,
    });

  } catch (error) {
    console.error("❌ Error saving offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
