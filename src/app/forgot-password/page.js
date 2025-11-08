'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { forgotPassword } from '@/utils/api/handlers';

import illustration from '@/../public/assets/images/png-img/forgot-password.png';

export default function ForgotPasswordPage() {
  // avoid extension-injected hydration diffs on inputs
  const [mounted, setMounted] = useState(false);

  // IMPORTANT: use the exact key name you asked for
  const [email_or_mobile, setEmailOrMobile] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [serverErr, setServerErr] = useState('');

  useEffect(() => setMounted(true), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerErr('');
    setStatus(null);

    const value = email_or_mobile.trim();
    if (!value) {
      setServerErr('Please enter your email or mobile number');
      setStatus('error');
      return;
    }

    try {
      setLoading(true);
      // call API: expects { email_or_mobile }
      await forgotPassword({ email_or_mobile: value });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerErr(err?.message || 'Failed to send reset instructions. Please try again.');
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
                Password <span className="font-caveat text-primary">Reset</span>
              </h2>
              <p className="mb-0">
                Enter your email or mobile to receive instructions to reset your password.
              </p>
            </div>

            <form className="register-form" onSubmit={onSubmit} noValidate>
              {status === 'success' && (
                <div className="alert alert-success text-start">
                  If the account exists, we’ve sent reset instructions.
                </div>
              )}
              {status === 'error' && serverErr && (
                <div className="alert alert-danger text-start">
                  {serverErr}
                </div>
              )}

              <div className="form-group mb-4">
                <label className="required">Enter Email Or Mobile</label>
                <input
                  type="text" /* can be email OR mobile */
                  name="email_or_mobile"
                  className={`form-control${status === 'error' && !email_or_mobile ? ' is-invalid' : ''}`}
                  value={mounted ? email_or_mobile : ''} /* avoid hydration noise */
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  autoComplete="username"
                  required
                />
                {status === 'error' && !email_or_mobile && (
                  <div className="invalid-feedback text-start d-block">
                    Enter your email or mobile
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Reset Password'}
              </button>
            </form>

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
