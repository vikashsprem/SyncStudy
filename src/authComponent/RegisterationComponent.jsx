import React, { useState, useEffect } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { executeRegistrationService, fetchOrganizations } from "../apiConfig/ApiService";
import CircularProgress from "@mui/material/CircularProgress";
import CreateOrganization from "../components/CreateOrganization";

const RegisterationComponent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    organizationCode: "",
    whatsappNumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  const navigate = useNavigate();

  const loadOrganizations = async () => {
    try {
      const response = await fetchOrganizations();
      setOrganizations(response.data);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCreateOrgSuccess = async (newOrg) => {
    setShowCreateOrg(false);
    await loadOrganizations();
    setFormData(prev => ({
      ...prev,
      organizationCode: newOrg.code
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await executeRegistrationService(formData);
      if (response.status === 201) {
        navigate("/auth/login");
      }
    } catch (error) {
      if (error.response?.data) {
        setError(error.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center mt-5 h-screen">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 w-1/3-md p-1 rounded-md mt-5"
          id="form"
        >
          <div className="ml-6 flex justify-center">
            <p id="account-paragraph" className="w-4/5 p-1">
              Sign up to start Exploring
            </p>
          </div>

          {error && (
            <div className="m-2 flex justify-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <div className="m-2 flex justify-center">
            <input
              placeholder="Enter your name"
              type="text"
              className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="m-2 flex justify-center">
            <input
              placeholder="name@domain.com"
              type="email"
              className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="m-2 flex justify-center">
            <input
              placeholder="Create password"
              type="password"
              className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="m-2 flex justify-center">
            <input
              placeholder="WhatsApp number (optional)"
              type="tel"
              className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
            />
          </div>

          <div className="m-2 flex flex-col items-center">
            <select
              className="input-box p-1 w-2/3 px-3 py-2 border-gray-400 border rounded-sm mb-2"
              name="organizationCode"
              required
              value={formData.organizationCode}
              onChange={handleChange}
            >
              <option value="">Select your organization</option>
              {loadingOrgs ? (
                <option disabled>Loading organizations...</option>
              ) : (
                organizations.map((org) => (
                  <option key={org.code} value={org.code}>
                    {org.name}
                  </option>
                ))
              )}
            </select>
            <p className="text-gray-400 text-sm text-center mt-1">
              Can't find your organization? Contact your administrator to create one.
            </p>
          </div>

          <div className="m-2 flex justify-center">
            <button
              type="submit"
              className="text-black p-2 w-2/3 font-semibold text-sm rounded-sm"
              id="continue-button"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center align-middle gap-3">
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <p className="border border-t-black opacity-20 w-3/5"></p>
          </div>

          <div>
            <div className="m-2 flex justify-center">
              <span className="border-gray border font-bold text-white p-2 w-2/3 text-center rounded-3xl text-sm opacity-50 cursor-not-allowed">
                Continue with Google
              </span>
            </div>
            <div className="m-2 flex justify-center">
              <span className="border-gray border font-bold text-white p-2 w-2/3 text-center rounded-3xl text-sm opacity-50 cursor-not-allowed">
                Continue with Facebook
              </span>
            </div>
            <div className="m-2 flex justify-center">
              <span className="border-gray border font-bold text-white p-2 w-2/3 text-center rounded-3xl text-sm opacity-50 cursor-not-allowed">
                Continue with phone number
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <p className="border border-t-black opacity-20 w-3/5"></p>
          </div>

          <div className="flex justify-center">
            <p
              style={{ fontSize: "0.73em" }}
              className="font-semibold opacity-50"
            >
              Already have an account?
              <Link to="/auth/login" className="text-white underline">
                {" "}
                Log in here
              </Link>
            </p>
          </div>
        </form>
      </div>

      {showCreateOrg && (
        <CreateOrganization
          onSuccess={handleCreateOrgSuccess}
          onCancel={() => setShowCreateOrg(false)}
        />
      )}
    </>
  );
};

export default RegisterationComponent;
