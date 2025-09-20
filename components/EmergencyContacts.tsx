
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { PersonalContact } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UserIcon } from './icons/UserIcon';

const nationalHelplines = [
  { name: 'National Emergency Number', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Fire', number: '101' },
  { name: 'Ambulance', number: '102' },
  { name: 'Disaster Management Services', number: '108' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'Child Helpline', number: '1098' },
];

type Notification = {
  type: 'success' | 'error';
  message: string;
};

const EmergencyContacts: React.FC = () => {
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await db.personalContacts.toArray();
        setPersonalContacts(contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        showNotification('error', 'Could not load personal contacts.');
      }
    };
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newContactName.trim() && newContactNumber.trim()) {
      try {
        const newContact: PersonalContact = { name: newContactName.trim(), number: newContactNumber.trim() };
        const id = await db.personalContacts.put(newContact);
        setPersonalContacts([...personalContacts, { ...newContact, id }]);
        setNewContactName('');
        setNewContactNumber('');
        setIsAdding(false);
        showNotification('success', 'Contact saved successfully!');
      } catch (error) {
        console.error("Failed to add contact:", error);
        showNotification('error', 'Failed to save contact.');
      }
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await db.personalContacts.delete(id);
      setPersonalContacts(personalContacts.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete contact:", error);
      showNotification('error', 'Failed to delete contact.');
    }
  };

  return (
    <div className="bg-brand-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-brand-gray-700">
       {notification && (
        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-semibold text-white ${notification.type === 'success' ? 'bg-brand-green' : 'bg-brand-red'}`}>
          {notification.message}
        </div>
      )}
      <h2 className="text-3xl font-bold text-brand-gray-100 mb-6 flex items-center gap-3">
        <PhoneIcon />
        Emergency Contacts
      </h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-brand-blue mb-4">National Helplines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nationalHelplines.map(contact => (
            <div key={contact.name} className="bg-brand-gray-900/50 p-4 rounded-lg border border-brand-gray-700">
              <p className="font-medium text-brand-gray-300">{contact.name}</p>
              <a href={`tel:${contact.number}`} className="text-2xl font-bold text-brand-orange hover:underline">{contact.number}</a>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-brand-blue">Personal Contacts</h3>
            {!isAdding && (
                <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
                    <PlusIcon /> Add Contact
                </button>
            )}
        </div>
        
        {isAdding && (
            <form onSubmit={handleAddContact} className="bg-brand-gray-900/50 p-4 rounded-lg border border-brand-gray-700 mb-4 space-y-4">
                <input
                    type="text"
                    placeholder="Name (e.g., Mom)"
                    value={newContactName}
                    onChange={e => setNewContactName(e.target.value)}
                    className="w-full p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100"
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newContactNumber}
                    onChange={e => setNewContactNumber(e.target.value)}
                    className="w-full p-2 bg-brand-gray-700 border border-brand-gray-600 rounded-md text-brand-gray-100"
                    required
                />
                <div className="flex gap-2">
                     <button type="submit" className="flex-1 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600">Save</button>
                     <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-brand-gray-600 text-white font-bold rounded-lg hover:bg-brand-gray-500">Cancel</button>
                </div>
            </form>
        )}

        <div className="space-y-3">
            {personalContacts.length > 0 ? personalContacts.map(contact => (
                <div key={contact.id} className="bg-brand-gray-900/50 p-4 rounded-lg border border-brand-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <UserIcon />
                        <div>
                            <p className="font-medium text-brand-gray-200">{contact.name}</p>
                            <a href={`tel:${contact.number}`} className="text-brand-gray-400 hover:underline">{contact.number}</a>
                        </div>
                    </div>
                    <button onClick={() => contact.id && handleDeleteContact(contact.id)} className="p-2 text-brand-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-full" aria-label={`Delete ${contact.name}`}>
                        <TrashIcon />
                    </button>
                </div>
            )) : (
                !isAdding && <p className="text-brand-gray-400 text-center py-4">You haven't added any personal contacts yet.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
