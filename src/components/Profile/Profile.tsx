import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home, Key, Shield, Cake, UserCog, Save } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  

  const [userData, setUserData] = useState({
    name: user?.name || 'Hrishikesh ',
    email: user?.email || 'hrishikesh.j@example.com',
    phone: '+91 9876543210',
    address: '1-2-345, Road No. 5, Banjara Hills, Hyderabad, Telangana 500034',
    birthday: '2005-06-15',
    emergencyContact: 'Lavanya (+91 9876543211)',
    allergies: 'Penicillin, Peanuts',
    medicalConditions: 'Hypertension, Type 2 Diabetes'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal information and settings
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Profile content */}
      <motion.div variants={item} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white">
                <img
                  src={user?.avatar || "Medical\project\assets\PIC 144kb.jpeg"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-primary-100">{userData.email}</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              <button
                className={`flex w-full items-center px-6 py-3 text-left ${
                  activeTab === 'personal' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('personal')}
              >
                <User className={`mr-3 h-5 w-5 ${
                  activeTab === 'personal' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span>Personal Information</span>
              </button>
              
              <button
                className={`flex w-full items-center px-6 py-3 text-left ${
                  activeTab === 'medical' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('medical')}
              >
                <Shield className={`mr-3 h-5 w-5 ${
                  activeTab === 'medical' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span>Medical Information</span>
              </button>
              
              <button
                className={`flex w-full items-center px-6 py-3 text-left ${
                  activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Key className={`mr-3 h-5 w-5 ${
                  activeTab === 'security' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <span>Security</span>
              </button>
              
              <button
                onClick={logout}
                className="flex w-full items-center px-6 py-3 text-left text-error-600 hover:bg-error-50"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'personal' && 'Personal Information'}
                {activeTab === 'medical' && 'Medical Information'}
                {activeTab === 'security' && 'Security Settings'}
              </h2>
            </div>
            
            <div className="p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="form-label">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-input"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <User className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userData.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="form-label">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userData.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-input"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="birthday" className="form-label">Date of Birth</label>
                      {isEditing ? (
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          className="form-input"
                          value={formData.birthday}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Cake className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{userData.birthday}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="form-label">Address</label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        name="address"
                        rows={2}
                        className="form-input"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-start">
                        <Home className="mr-2 mt-0.5 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userData.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="emergency-contact" className="form-label">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="emergency-contact"
                        name="emergencyContact"
                        className="form-input"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{userData.emergencyContact}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'medical' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="allergies" className="form-label">Allergies</label>
                    {isEditing ? (
                      <textarea
                        id="allergies"
                        name="allergies"
                        rows={2}
                        className="form-input"
                        value={formData.allergies}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-gray-900">{userData.allergies || 'None'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="medical-conditions" className="form-label">Medical Conditions</label>
                    {isEditing ? (
                      <textarea
                        id="medical-conditions"
                        name="medicalConditions"
                        rows={3}
                        className="form-input"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="rounded-md bg-gray-50 p-3">
                        <p className="text-gray-900">{userData.medicalConditions || 'None'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-md bg-primary-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-primary-800">Medical Data Privacy</h3>
                        <div className="mt-2 text-sm text-primary-700">
                          <p>
                            Your medical information is protected and only shared with healthcare providers you authorize.
                            You can control who has access to your data in the privacy settings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">Change Password</h3>
                    <div className="mt-3 space-y-4">
                      <div>
                        <label htmlFor="current-password" className="form-label">Current Password</label>
                        <input
                          type="password"
                          id="current-password"
                          className="form-input"
                          placeholder="Enter your current password"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="new-password" className="form-label">New Password</label>
                        <input
                          type="password"
                          id="new-password"
                          className="form-input"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                      </div>
                      
                      <div>
                        <button className="btn-primary">Update Password</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900">Two-Factor Authentication</h3>
                    <div className="mt-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700">Protect your account with two-factor authentication</p>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                          </p>
                        </div>
                        <button className="btn-outline">Enable</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900">Login Sessions</h3>
                    <div className="mt-3">
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Session</p>
                            <p className="text-xs text-gray-500">
                              Started: {new Date().toLocaleString()}
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;