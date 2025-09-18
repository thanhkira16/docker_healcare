import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import '../scss/Contact.scss';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const inquiryTypes = [
        {
            value: 'general',
            label: <FormattedMessage id="contact.inquiry_types.general.label" />,
            description: <FormattedMessage id="contact.inquiry_types.general.description" />,
            icon: '❓'
        },
        {
            value: 'support',
            label: <FormattedMessage id="contact.inquiry_types.support.label" />,
            description: <FormattedMessage id="contact.inquiry_types.support.description" />,
            icon: '🔧'
        },
        {
            value: 'business',
            label: <FormattedMessage id="contact.inquiry_types.business.label" />,
            description: <FormattedMessage id="contact.inquiry_types.business.description" />,
            icon: '💼'
        },
        {
            value: 'feedback',
            label: <FormattedMessage id="contact.inquiry_types.feedback.label" />,
            description: <FormattedMessage id="contact.inquiry_types.feedback.description" />,
            icon: '💬'
        }
    ];

    const contactBenefits = [
        {
            title: <FormattedMessage id="contact.benefits.security.title" />,
            description: <FormattedMessage id="contact.benefits.security.description" />,
            icon: '🛡️'
        },
        {
            title: <FormattedMessage id="contact.benefits.response.title" />,
            description: <FormattedMessage id="contact.benefits.response.description" />,
            icon: '⏰'
        },
        {
            title: <FormattedMessage id="contact.benefits.support.title" />,
            description: <FormattedMessage id="contact.benefits.support.description" />,
            icon: '📞'
        },
        {
            title: <FormattedMessage id="contact.benefits.team.title" />,
            description: <FormattedMessage id="contact.benefits.team.description" />,
            icon: '👥'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                type: 'general'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
    };

    return (
        <div className="container contact-section">
            <div className="">
                <div className="contact-header">
                    <h2 className="contact-title">
                        <FormattedMessage id="contact.title" />
                    </h2>
                    <p className="contact-subtitle">
                        <FormattedMessage id="contact.subtitle" />
                    </p>
                </div>

                <div className="contact-content">
                    <div className="contact-form-wrapper">
                        <div className="contact-form-container">
                            {isSubmitted ? (
                                <div className="success-message">
                                    <div className="success-icon">✅</div>
                                    <h3><FormattedMessage id="contact.success.title" /></h3>
                                    <p><FormattedMessage id="contact.success.description" /></p>
                                    <button
                                        className="btn-primary"
                                        onClick={resetForm}
                                    >
                                        <FormattedMessage id="contact.form.send_another" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="trust-indicators">
                                        {contactBenefits.map((benefit, index) => (
                                            <div key={index} className="trust-item">
                                                <div className="trust-icon">{benefit.icon}</div>
                                                <div className="trust-content">
                                                    <div className="trust-title">{benefit.title}</div>
                                                    <div className="trust-description">{benefit.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-group inquiry-types">
                                            <label className="form-label">
                                                <FormattedMessage id="contact.form.help_question" />
                                            </label>
                                            <div className="inquiry-grid">
                                                {inquiryTypes.map((type) => (
                                                    <label
                                                        key={type.value}
                                                        className={`inquiry-option ${formData.type === type.value ? 'selected' : ''}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type.value}
                                                            checked={formData.type === type.value}
                                                            onChange={handleInputChange}
                                                        />
                                                        <div className="inquiry-content">
                                                            <div className="inquiry-icon">{type.icon}</div>
                                                            <div className="inquiry-text">
                                                                <div className="inquiry-label">{type.label}</div>
                                                                <div className="inquiry-description">{type.description}</div>
                                                            </div>
                                                        </div>
                                                        {formData.type === type.value && (
                                                            <div className="selected-indicator"></div>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <FormattedMessage id="contact.form.name" />
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-input"
                                                    placeholder={document.querySelector('html').getAttribute('lang') === 'en' ? 'Enter your full name' : 'Nhập họ và tên của bạn'}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">
                                                    <FormattedMessage id="contact.form.email" />
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="form-input"
                                                    placeholder={document.querySelector('html').getAttribute('lang') === 'en' ? 'Enter your email address' : 'Nhập địa chỉ email'}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <FormattedMessage id="contact.form.subject" />
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="form-input"
                                                placeholder={document.querySelector('html').getAttribute('lang') === 'en' ? 'Message subject' : 'Tiêu đề của tin nhắn'}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <FormattedMessage id="contact.form.message" />
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={5}
                                                className="form-textarea"
                                                placeholder={document.querySelector('html').getAttribute('lang') === 'en' ? 'Describe your request in detail...' : 'Mô tả chi tiết yêu cầu của bạn...'}
                                            />
                                        </div>

                                        <div className="form-submit">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn-submit"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="loading-spinner"></div>
                                                        <span><FormattedMessage id="contact.form.sending" /></span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>✉️</span>
                                                        <span><FormattedMessage id="contact.form.submit" /></span>
                                                    </>
                                                )}
                                            </button>
                                            <p className="privacy-note">
                                                <FormattedMessage id="contact.form.privacy" />{' '}
                                                <span className="privacy-link">
                                                    <FormattedMessage id="contact.form.privacy_link" />
                                                </span>.
                                            </p>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="contact-sidebar">
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.7340250120264!2d108.25065207500269!3d15.975260284690632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142108997dc971f%3A0x1295cb3d313469c9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiB2w6AgVHJ1eeG7gW4gdGjDtG5nIFZp4buHdCAtIEjDoG4sIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1757258957997!5m2!1svi!2s"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office Location"
                                className="map-iframe"
                            />
                            <div className="map-overlay">
                                <div className="location-info">
                                    <div className="location-icon">📍</div>
                                    <div className="location-details">
                                        <h4 className="location-title">
                                            <FormattedMessage id="contact.location.title" />
                                            <div className="status-indicator"></div>
                                        </h4>
                                        <p className="location-address">
                                            <FormattedMessage id="contact.location.address" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="faq-section">
                            <h3 className="faq-title">
                                <span className="faq-icon">💬</span>
                                <FormattedMessage id="contact.quick_answers.title" />
                            </h3>
                            <div className="faq-list">
                                <div className="faq-item blue">
                                    <h4><FormattedMessage id="contact.quick_answers.response_time.title" /></h4>
                                    <p><FormattedMessage id="contact.quick_answers.response_time.description" /></p>
                                </div>
                                <div className="faq-item green">
                                    <h4><FormattedMessage id="contact.quick_answers.phone_support.title" /></h4>
                                    <p><FormattedMessage id="contact.quick_answers.phone_support.description" /></p>
                                </div>
                                <div className="faq-item purple">
                                    <h4><FormattedMessage id="contact.quick_answers.emergency.title" /></h4>
                                    <p><FormattedMessage id="contact.quick_answers.emergency.description" /></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;