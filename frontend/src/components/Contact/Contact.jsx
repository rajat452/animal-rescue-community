import { useState } from 'react';
import axiosInstance from '../../AxiosInstance';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        location: '', // This will be auto-filled with live location
    });

    const [submittedData, setSubmittedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone number validation function (Exactly 10 digits)
    const validatePhone = (phoneNo) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNo);
    };

    // Fetch live location using Geolocation API
    const fetchLiveLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Use OpenStreetMap's Nominatim API for reverse geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    if (data.display_name) {
                        setFormData((prevData) => ({
                            ...prevData,
                            location: data.display_name, // Set the fetched address
                        }));
                    } else {
                        setError('Unable to fetch location details.');
                    }
                } catch (err) {
                    setError('Error fetching location details.');
                }
            },
            (err) => {
                setError(`Error fetching location: ${err.message}`);
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend Validation
        if (!formData.name || !formData.email || !formData.phoneNo || !formData.location) {
            setError('Please fill in all fields.');
            return;
        }
        if (!validateEmail(formData.email)) {
            setError('Invalid email format.');
            return;
        }
        if (!validatePhone(formData.phoneNo)) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post('http://localhost:8080/api/contacts', formData);
            setSubmittedData(response.data);
            setFormData({ name: '', email: '', phoneNo: '', location: '' });
        } catch (err) {
            setError('Error submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-top justify-center bg-white sm:items-center sm:pt-0 min-h-screen">
            <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Contact Info Section */}
                        <div className="p-6 mr-2 bg-gray-100 sm:rounded-lg">
                            <h1 className="text-3xl sm:text-4xl text-gray-800 font-extrabold tracking-tight">
                                Get in touch:
                            </h1>
                            <p className="text-lg sm:text-xl font-medium text-gray-600 mt-2">
                                Fill in the form to start a conversation
                            </p>

                            <div className="mt-8 space-y-4">
                                <p className="text-gray-600 text-lg font-semibold">📍 Pune, Pashan</p>
                                <p className="text-gray-600 text-lg font-semibold">📞 +91 7875651700</p>
                                <p className="text-gray-600 text-lg font-semibold">📧 arc@gmail.com</p>
                            </div>
                        </div>

                        {/* Right Form Section */}
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col justify-center bg-white shadow-lg rounded-lg">
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Full Name" 
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />

                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Email" 
                                className="w-full mt-4 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />

                            <input 
                                type="tel" 
                                name="phoneNo" 
                                value={formData.phoneNo} 
                                onChange={handleChange} 
                                placeholder="Phone Number (10 digits)" 
                                className="w-full mt-4 py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />

                            <div className="relative mt-4">
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    placeholder="Location (Click button to auto-fill)" 
                                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                    readOnly // Prevent manual editing
                                />
                                <button 
                                    type="button" 
                                    onClick={fetchLiveLocation} 
                                    className="absolute top-0 right-0 h-full px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300"
                                >
                                    📍 Fetch Location
                                </button>
                            </div>

                            {error && <p className="text-red-500 mt-2">{error}</p>}

                            <button 
                                type="submit" 
                                className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg mt-6 transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Display Submitted Data */}
            {submittedData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submitted Data</h2>
                        <p className="text-gray-700"><strong>Name:</strong> {submittedData.name}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {submittedData.email}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {submittedData.phoneNo}</p>
                        <p className="text-gray-700"><strong>Location:</strong> {submittedData.location}</p>
                        <button 
                            onClick={() => setSubmittedData(null)} 
                            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-6 hover:bg-blue-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}