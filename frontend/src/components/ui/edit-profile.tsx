import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditProfileFormProps {
  profile: {
    name: string;
    email: string;
    dietaryPreferences: string[];
  };
  onSave: (updatedProfile: any) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profile,
  onSave,
}) => {
  const [formData, setFormData] = React.useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        label="Dietary Preferences"
        name="dietaryPreferences"
        value={formData.dietaryPreferences}
        onChange={handleChange}
      />
      <Button onClick={() => onSave(formData)}>Save Changes</Button>
    </div>
  );
};

export default EditProfileForm;
