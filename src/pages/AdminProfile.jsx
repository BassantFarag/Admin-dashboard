import React, { useEffect, useState, useContext } from "react";
import { User, Mail, Phone, ShieldCheck, Save, Loader2, Upload, Camera } from "lucide-react";
import { getUserById, updateUser } from "../api/usersApi";
import AuthContext from "../contexts/AuthContext";
import { toast } from "react-toastify";

const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const AdminProfile = () => {
  
  const { user, setUser } = useContext(AuthContext);
  const currentUserId = user?._id || user?.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });


  useEffect(() => {
    if (currentUserId) {
      setLoading(true);
      getUserById(currentUserId)
        .then((res) => {
          const userData = res.data?.user || res.data;
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            role: userData.role || "",
            avatar: userData.avatar || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Failed to load profile data!");
          setLoading(false);
        });
    }
  }, [currentUserId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
       
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300; 
        const scaleFactor = MAX_WIDTH / img.width;
        
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

     
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        setFormData((prev) => ({
          ...prev,
          avatar: compressedBase64,
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setMessage({ type: "", text: "" });

  try {
    let updatedUserData = { ...formData };

    if (updateUser) {
      const res = await updateUser(currentUserId, formData);
      // إذا كان الـ API يرجع البيانات المحدثة مباشرة نأخذها منه
      if (res?.data?.user) {
        updatedUserData = res.data.user;
      } else if (res?.data) {
        updatedUserData = { ...formData, ...res.data };
      }
    }

    // 1. تحديث الـ AuthContext مباشرة
    if (setUser) {
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUserData,
      }));
    }

    // 2. تحديث الـ LocalStorage بكافة المفاتيح المحتملة
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    const newUserData = { ...existingUser, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));

    setMessage({ type: "success", text: "Profile updated successfully!" });
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    setMessage({ type: "error", text: "Failed to update profile." });
    toast.error("Failed to update profile.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-bg-main text-primary">
        <Loader2 className="animate-spin text-active" size={32} />
      </div>
    );
  }

  const finalAvatar = formData.avatar || `${FALLBACK_AVATAR}${encodeURIComponent(formData.name || "Admin")}`;

  return (
    <div className="p-6 bg-bg-main text-primary min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-xs text-secondary mt-1">Manage your account information</p>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-medium ${
            message.type === "success"
              ? "bg-active/10 border border-active/30 text-active"
              : "bg-danger/10 border border-danger/30 text-danger"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Profile Card */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 flex flex-col items-center text-center shadow-lg h-fit">
          <div className="relative group mb-4">
            <img
              src={finalAvatar}
              alt={formData.name}
              className="w-28 h-28 rounded-full object-cover border-2 border-active/40 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${FALLBACK_AVATAR}${encodeURIComponent(formData.name || "A")}`;
              }}
            />

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-active text-bg-main rounded-full cursor-pointer hover:scale-105 transition-transform shadow-md"
              title="Upload new photo"
            >
              <Camera size={16} />
            </label>
          </div>

          <h2 className="text-lg font-bold">{formData.name || "Admin User"}</h2>
          <p className="text-xs text-secondary mb-3">{formData.email}</p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-active/10 text-active border border-active/20">
            <ShieldCheck size={14} />
            {formData.role ? formData.role.toUpperCase() : "ADMIN"}
          </span>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-card border border-border-custom rounded-2xl p-6 shadow-lg">
          <h3 className="text-md font-semibold mb-4 border-b border-border-custom pb-3">
            Personal Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Full Name / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-input border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:border-active focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-input border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:border-active focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-input border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-primary focus:border-active focus:outline-none transition-colors"
                  placeholder="+20 123 456 789"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Profile Picture
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-input border border-border-custom rounded-xl text-xs text-secondary hover:text-primary hover:border-active cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <Upload size={15} />
                  Choose Image File
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-active hover:bg-active/90 text-bg-main font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;