import React from 'react'

export default function Address() {
  return (
    <div className="col-xl-8">
                <h4 className="title mb-15">Billing Details</h4>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>First Name*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="First Name"
                        name="firstName"
                        value={useAddress?.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>Last Name*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Last Name"
                        name="lastName"
                        value={useAddress?.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Address*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Street Address"
                        name="addressLine1"
                        value={useAddress?.addressLine1}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Apartment, suite, unit etc. (optional)"
                        name="addressLine2"
                        value={useAddress?.addressLine2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>City</label>
                      <input
                        type="text"
                        className="form_control no-drop"
                        placeholder="Town / City"
                        name="city"
                        value={useAddress?.city}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_group">
                      <label>Postcode</label>
                      <input
                        type="text"
                        className="form_control no-drop"
                        placeholder="Postcode / Zip"
                        name="postcode"
                        value={useAddress?.postcode}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Contact*</label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Your Phone"
                        name="contact"
                        value={useAddress?.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form_group">
                      <label>Order Notes (optional)</label>
                      <textarea
                        name="orderNotes"
                        className="form_control"
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        value={useAddress?.orderNotes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
  )
}
