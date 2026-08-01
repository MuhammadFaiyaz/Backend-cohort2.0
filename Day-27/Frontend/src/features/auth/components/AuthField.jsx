const AuthField = ({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  autoComplete,
  required = false,
  className = "",
//   error,
}) => {
  return (
    <div className={`auth__field`}>
      <label htmlFor={id} className="auth__label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="auth__input"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoComplete={autoComplete}
        required={required}
      />
      {/* {error && <p className="auth__error">{error}</p>} */}
    </div>
  );
};

export default AuthField;
