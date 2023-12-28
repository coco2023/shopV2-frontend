import React, { useState } from "react";
import axios from "axios";

const MerchantOnboardingForm = () => {
  // Initial state for all fields needed for the JSON payload
  const [merchantInfo, setMerchantInfo] = useState({
    givenName: "",
    surname: "",
    middleName: "",
    suffix: "",
    fullName: "",
    citizenship: "",
    addressLine1: "",
    addressLine2: "",
    adminArea2: "",
    adminArea1: "",
    postalCode: "",
    countryCode: "",
    phoneCountryCode: "",
    nationalNumber: "",
    phoneExtensionNumber: "",
    dateOfBirth: "",
    businessName: "",
    businessType: "",
    businessSubtype: "",
    businessCategory: "",
    mccCode: "",
    businessSubcategory: "",
    incorporationCountryCode: "",
    incorporationDate: "",
    customerServiceEmail: "",
    website: "",
    percentageOfOwnership: "",
    role: "",
    annualSalesVolumeMinimum: "",
    annualSalesVolumeMaximum: "",
    averageMonthlyVolumeMinimum: "",
    averageMonthlyVolumeMaximum: "",
    purposeCode: "",
    email: "",
    preferredLanguageCode: "",
    trackingId: "",
    partnerLogoUrl: "",
    returnUrl: "",
    returnUrlDescription: "",
    actionRenewalUrl: "",
    showAddCreditCard: false,
    bankNickname: "",
    accountNumber: "",
    accountType: "",
    bankCurrencyCode: "",
    bankRoutingNumber: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMerchantInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      individual_owners: [
        {
          names: [
            {
              prefix: merchantInfo.suffix, // Assuming 'prefix' was meant to be 'suffix' in the state
              given_name: merchantInfo.givenName,
              surname: merchantInfo.surname,
              middle_name: merchantInfo.middleName,
              suffix: merchantInfo.suffix,
              full_name: merchantInfo.fullName,
              type: "LEGAL",
            },
          ],
          citizenship: merchantInfo.citizenship,
          addresses: [
            {
              address_line_1: merchantInfo.addressLine1,
              address_line_2: merchantInfo.addressLine2,
              admin_area_2: merchantInfo.adminArea2,
              admin_area_1: merchantInfo.adminArea1,
              postal_code: merchantInfo.postalCode,
              country_code: merchantInfo.countryCode,
              type: "HOME",
            },
          ],
          phones: [
            {
              country_code: merchantInfo.phoneCountryCode,
              national_number: merchantInfo.nationalNumber,
              extension_number: merchantInfo.phoneExtensionNumber,
              type: "MOBILE",
            },
          ],
          birth_details: {
            date_of_birth: merchantInfo.dateOfBirth,
          },
          type: "PRIMARY",
        },
      ],
      business_entity: {
        business_type: {
          type: merchantInfo.businessType,
          subtype: merchantInfo.businessSubtype,
        },
        business_industry: {
          category: merchantInfo.businessCategory,
          mcc_code: merchantInfo.mccCode,
          subcategory: merchantInfo.businessSubcategory,
        },
        business_incorporation: {
          incorporation_country_code: merchantInfo.incorporationCountryCode,
          incorporation_date: merchantInfo.incorporationDate,
        },
        names: [
          {
            business_name: merchantInfo.businessName,
            type: "LEGAL_NAME",
          },
        ],
        emails: [
          {
            type: "CUSTOMER_SERVICE",
            email: merchantInfo.customerServiceEmail,
          },
        ],
        website: merchantInfo.website,
        addresses: [
          {
            address_line_1: merchantInfo.addressLine1,
            address_line_2: merchantInfo.addressLine2,
            admin_area_2: merchantInfo.adminArea2,
            admin_area_1: merchantInfo.adminArea1,
            postal_code: merchantInfo.postalCode,
            country_code: merchantInfo.countryCode,
            type: "WORK",
          },
        ],
        phones: [
          {
            country_code: merchantInfo.phoneCountryCode,
            national_number: merchantInfo.nationalNumber,
            extension_number: merchantInfo.phoneExtensionNumber,
            type: "CUSTOMER_SERVICE",
          },
        ],
        // ... Include other fields from `business_entity` as needed
      },
      // ... Include other top-level fields as needed
      email: merchantInfo.email,
      preferred_language_code: merchantInfo.preferredLanguageCode,
      tracking_id: merchantInfo.trackingId,
      partner_config_override: {
        partner_logo_url: merchantInfo.partnerLogoUrl,
        return_url: merchantInfo.returnUrl,
        return_url_description: merchantInfo.returnUrlDescription,
        action_renewal_url: merchantInfo.actionRenewalUrl,
        show_add_credit_card: merchantInfo.showAddCreditCard,
      },
      operations: [
        {
          operation: "BANK_ADDITION",
        },
      ],
      financial_instruments: {
        banks: [
          {
            nick_name: merchantInfo.bankNickname,
            account_number: merchantInfo.accountNumber,
            account_type: merchantInfo.accountType,
            currency_code: merchantInfo.bankCurrencyCode,
            identifiers: [
              {
                type: "ROUTING_NUMBER_1",
                value: merchantInfo.bankRoutingNumber,
              },
            ],
          },
        ],
      },
      legal_consents: [
        {
          type: "SHARE_DATA_CONSENT",
          granted: true,
        },
      ],
      products: ["EXPRESS_CHECKOUT"],
    };

    // After constructing the payload, call the onFormSubmit function
    // and pass the payload to it. This function could make the API call.
    // onFormSubmit(payload);

    // Now send the payload to the PayPal API
    // Replace 'YOUR_ACCESS_TOKEN' with the actual access token
    try {
      const response = await axios.post(
        "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer A21AAJXOAX1swyjRuVu-sINZfi0NHQGADatY3x8CF8m1Dq3TRbfP1z1r0hkKz4ma1qxXR7g20CK4EBFJ7UVYG2G6tyfInkp3g`,
          },
        }
      );
      // Handle response here
      console.log(response.data);
    } catch (error) {
      // Handle error here
      console.error("Error submitting to PayPal", error);
    }
  };

  // Render the form with all fields
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Given Name:
        <input
          type="text"
          name="givenName"
          value={merchantInfo.givenName}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Surname:
        <input
          type="text"
          name="surname"
          value={merchantInfo.surname}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Middle Name:
        <input
          type="text"
          name="middleName"
          value={merchantInfo.middleName}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Suffix:
        <input
          type="text"
          name="suffix"
          value={merchantInfo.suffix}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Full Name:
        <input
          type="text"
          name="fullName"
          value={merchantInfo.fullName}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Citizenship:
        <input
          type="text"
          name="citizenship"
          value={merchantInfo.citizenship}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Address Line 1:
        <input
          type="text"
          name="addressLine1"
          value={merchantInfo.addressLine1}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Address Line 2:
        <input
          type="text"
          name="addressLine2"
          value={merchantInfo.addressLine2}
          onChange={handleInputChange}
        />
      </label>

      <label>
        City (Admin Area 2):
        <input
          type="text"
          name="adminArea2"
          value={merchantInfo.adminArea2}
          onChange={handleInputChange}
        />
      </label>

      <label>
        State/Province/Region (Admin Area 1):
        <input
          type="text"
          name="adminArea1"
          value={merchantInfo.adminArea1}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Postal Code:
        <input
          type="text"
          name="postalCode"
          value={merchantInfo.postalCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Country Code:
        <input
          type="text"
          name="countryCode"
          value={merchantInfo.countryCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Phone Country Code:
        <input
          type="text"
          name="phoneCountryCode"
          value={merchantInfo.phoneCountryCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        National Number:
        <input
          type="text"
          name="nationalNumber"
          value={merchantInfo.nationalNumber}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Phone Extension Number:
        <input
          type="text"
          name="phoneExtensionNumber"
          value={merchantInfo.phoneExtensionNumber}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="dateOfBirth"
          value={merchantInfo.dateOfBirth}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Business Name:
        <input
          type="text"
          name="businessName"
          value={merchantInfo.businessName}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Business Type:
        <input
          type="text"
          name="businessType"
          value={merchantInfo.businessType}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Business Subtype:
        <input
          type="text"
          name="businessSubtype"
          value={merchantInfo.businessSubtype}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Business Category:
        <input
          type="text"
          name="businessCategory"
          value={merchantInfo.businessCategory}
          onChange={handleInputChange}
        />
      </label>

      <label>
        MCC Code:
        <input
          type="text"
          name="mccCode"
          value={merchantInfo.mccCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Business Subcategory:
        <input
          type="text"
          name="businessSubcategory"
          value={merchantInfo.businessSubcategory}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Incorporation Country Code:
        <input
          type="text"
          name="incorporationCountryCode"
          value={merchantInfo.incorporationCountryCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Incorporation Date:
        <input
          type="date"
          name="incorporationDate"
          value={merchantInfo.incorporationDate}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Customer Service Email:
        <input
          type="email"
          name="customerServiceEmail"
          value={merchantInfo.customerServiceEmail}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Website:
        <input
          type="url"
          name="website"
          value={merchantInfo.website}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Percentage of Ownership:
        <input
          type="number"
          name="percentageOfOwnership"
          value={merchantInfo.percentageOfOwnership}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Role:
        <input
          type="text"
          name="role"
          value={merchantInfo.role}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Annual Sales Volume Minimum:
        <input
          type="number"
          name="annualSalesVolumeMinimum"
          value={merchantInfo.annualSalesVolumeMinimum}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Annual Sales Volume Maximum:
        <input
          type="number"
          name="annualSalesVolumeMaximum"
          value={merchantInfo.annualSalesVolumeMaximum}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Average Monthly Volume Minimum:
        <input
          type="number"
          name="averageMonthlyVolumeMinimum"
          value={merchantInfo.averageMonthlyVolumeMinimum}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Average Monthly Volume Maximum:
        <input
          type="number"
          name="averageMonthlyVolumeMaximum"
          value={merchantInfo.averageMonthlyVolumeMaximum}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Purpose Code:
        <input
          type="text"
          name="purposeCode"
          value={merchantInfo.purposeCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={merchantInfo.email}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Preferred Language Code:
        <input
          type="text"
          name="preferredLanguageCode"
          value={merchantInfo.preferredLanguageCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Tracking ID:
        <input
          type="text"
          name="trackingId"
          value={merchantInfo.trackingId}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Partner Logo URL:
        <input
          type="url"
          name="partnerLogoUrl"
          value={merchantInfo.partnerLogoUrl}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Return URL:
        <input
          type="url"
          name="returnUrl"
          value={merchantInfo.returnUrl}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Return URL Description:
        <input
          type="text"
          name="returnUrlDescription"
          value={merchantInfo.returnUrlDescription}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Action Renewal URL:
        <input
          type="url"
          name="actionRenewalUrl"
          value={merchantInfo.actionRenewalUrl}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Show Add Credit Card:
        <input
          type="checkbox"
          name="showAddCreditCard"
          checked={merchantInfo.showAddCreditCard}
          onChange={(e) =>
            setMerchantInfo((prevInfo) => ({
              ...prevInfo,
              showAddCreditCard: e.target.checked,
            }))
          }
        />
      </label>

      <label>
        Bank Nickname:
        <input
          type="text"
          name="bankNickname"
          value={merchantInfo.bankNickname}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Account Number:
        <input
          type="text"
          name="accountNumber"
          value={merchantInfo.accountNumber}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Account Type:
        <input
          type="text"
          name="accountType"
          value={merchantInfo.accountType}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Bank Currency Code:
        <input
          type="text"
          name="bankCurrencyCode"
          value={merchantInfo.bankCurrencyCode}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Bank Routing Number:
        <input
          type="text"
          name="bankRoutingNumber"
          value={merchantInfo.bankRoutingNumber}
          onChange={handleInputChange}
        />
      </label>

      <button type="submit">Submit Onboarding Info</button>
    </form>
  );
};

export default MerchantOnboardingForm;
