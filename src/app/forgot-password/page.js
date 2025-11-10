// src/app/forgot-password/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  forgotPassword,
  verifyOtp,
  resetPasswordApi,
} from '@/utils/api/handlers';

import illustration from '@/../public/assets/images/png-img/forgot-password.png';

export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false);

  // form fields
  const [email_or_mobile, setEmailOrMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [confirm_new_password, setConfirmNewPassword] = useState('');

  // eye icon toggles (like login page)
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);

  // internal token from verify-otp
  const [reset_token, setResetToken] = useState(null);

  // ui states
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request'); // request | verify | reset | done
  const [serverMsg, setServerMsg] = useState('');
  const [serverErr, setServerErr] = useState('');

  useEffect(() => setMounted(true), []);

  const clearAlerts = () => {
    setServerMsg('');
    setServerErr('');
  };

  // --- STEP 1: REQUEST OTP ---
  const onRequest = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!email_or_mobile.trim()) {
      setServerErr('Please enter your email or mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email_or_mobile });
      const msg = res?.message || 'Request processed.';
      const otpText = res?.data?.otp ? ` OTP: ${res.data.otp}` : '';
      setServerMsg(msg + otpText); // prints OTP when present
      setStep('verify');
    } catch (err) {
      setServerErr(err?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const onVerify = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!otp.trim()) {
      setServerErr('Please enter OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ email_or_mobile, otp });
      setServerMsg(res?.message || 'OTP verified successfully.');
      setResetToken(res?.data?.reset_token || null);
      setStep('reset');
    } catch (err) {
      setServerErr(err?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: RESET PASSWORD ---
  const onReset = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!new_password) return setServerErr('Please enter a new password.');
    if (new_password !== confirm_new_password)
      return setServerErr('Passwords do not match.');

    try {
      setLoading(true);
      const res = await resetPasswordApi({
        reset_token,
        new_password,
        confirm_new_password,
      });
      setServerMsg(res?.message || 'Password reset successful.');
      setStep('done');
    } catch (err) {
      setServerErr(err?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 p-sm-5">
      <div className="row g-4 g-xl-5 justify-content-between align-items-center">
        <div className="col-xl-5 d-flex justify-content-center">
          <div className="authentication-wrap overflow-hidden position-relative text-center text-sm-start my-5">
            <div className="mb-5">
              <h2 className="display-6 fw-semibold mb-3">
                {step === 'request' && <>Password <span className="font-caveat text-primary">Reset</span></>}
                {step === 'verify' && <>Verify <span className="font-caveat text-primary">OTP</span></>}
                {step === 'reset' && <>Set New <span className="font-caveat text-primary">Password</span></>}
                {step === 'done' && <>All <span className="font-caveat text-primary">Set</span></>}
              </h2>
              <p className="mb-0">
                {step === 'request' && 'Enter your email or mobile to receive an OTP.'}
                {step === 'verify' && 'Enter the OTP you received to continue.'}
                {step === 'reset' && 'Choose a new password for your account.'}
                {step === 'done' && 'Your password has been reset successfully.'}
              </p>
            </div>

            {serverMsg && <div className="alert alert-success text-start">{serverMsg}</div>}
            {serverErr && <div className="alert alert-danger text-start">{serverErr}</div>}

            {/* STEP: Request OTP */}
            {step === 'request' && (
              <form className="register-form" onSubmit={onRequest} noValidate>
                <div className="form-group mb-4">
                  <label className="required">Enter Email Or Mobile</label>
                  <input
                    type="text"
                    name="email_or_mobile"
                    className="form-control"
                    value={mounted ? email_or_mobile : ''}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                  {loading ? 'Sending…' : 'Send OTP'}
                </button>
              </form>
            )}

            {/* STEP: Verify OTP */}
            {step === 'verify' && (
              <form className="register-form" onSubmit={onVerify} noValidate>
                <div className="form-group mb-3">
                  <label className="required">Email / Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    value={mounted ? email_or_mobile : ''}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    readOnly
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="required">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50"
                    disabled={loading}
                    onClick={onRequest}
                  >
                    {loading ? 'Sending…' : 'Resend OTP'}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-50"
                    disabled={loading}
                  >
                    {loading ? 'Verifying…' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP: Reset Password */}
            {step === 'reset' && (
              <form className="register-form" onSubmit={onReset} noValidate>
                <div className="form-group mb-3">
                  <label className="required">Email / Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    value={mounted ? email_or_mobile : ''}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    readOnly
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="required">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                  />
                </div>

                {/* New Password with eye icon */}
                <div className="form-group mb-3 position-relative">
                  <label className="required">New Password</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="form-control password"
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    aria-label="toggle password"
                    className="btn btn-sm btn-link position-absolute top-0 end-0 mt-2 me-2"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    <i className={`fa-regular ${showPwd ? 'fa-eye' : 'fa-eye-slash'}`} />
                  </button>
                </div>

                {/* Confirm New Password with eye icon */}
                <div className="form-group mb-4 position-relative">
                  <label className="required">Confirm New Password</label>
                  <input
                    type={showPwdConfirm ? 'text' : 'password'}
                    className="form-control password"
                    value={confirm_new_password}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    aria-label="toggle password confirmation"
                    className="btn btn-sm btn-link position-absolute top-0 end-0 mt-2 me-2"
                    onClick={() => setShowPwdConfirm((v) => !v)}
                  >
                    <i className={`fa-regular ${showPwdConfirm ? 'fa-eye' : 'fa-eye-slash'}`} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? 'Updating…' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* STEP: Done */}
            {step === 'done' && (
              <div className="text-start">
                <p className="mb-4">You can now log in with your new password.</p>
                <Link href="/login" className="btn btn-primary btn-lg w-100">
                  Go to Login
                </Link>
              </div>
            )}

            <div className="bottom-text text-center mt-4">
              Remember your password?{' '}
              <Link href="/login" className="fw-medium text-decoration-underline">
                Log in
              </Link>
            </div>
          </div>
        </div>

        <div className="col-xl-7 d-none d-xl-block">
          <div className="background-image bg-light d-flex flex-column h-100 justify-content-center p-5 rounded-4">
            <div className="py-5 text-center">
              <div className="mb-5">
                <h2 className="fw-semibold">
                  Effortlessly organize your<br /> workspace with ease.
                </h2>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  <br /> content of a page when looking at its layout.
                </p>
              </div>
              <Image src={illustration} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
