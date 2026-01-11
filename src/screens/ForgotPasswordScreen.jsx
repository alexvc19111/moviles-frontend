import React, { useState } from "react";
import {SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image} from "react-native";
import WebIcon from "../components/WebIcon";

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nueva contraseña
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codigoEnviado, setCodigoEnviado] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Validar email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrors({ email: "Ingresa tu correo electrónico" });
      return false;
    } else if (!emailRegex.test(email)) {
      setErrors({ email: "Correo electrónico inválido" });
      return false;
    }
    return true;
  };

  // Validar código
  const validateCodigo = () => {
    if (!codigo.trim()) {
      setErrors({ codigo: "Ingresa el código de verificación" });
      return false;
    } else if (codigo.length !== 6) {
      setErrors({ codigo: "El código debe tener 6 dígitos" });
      return false;
    } else if (codigo !== codigoEnviado) {
      setErrors({ codigo: "Código incorrecto" });
      return false;
    }
    return true;
  };

  // Validar nueva contraseña
  const validatePassword = () => {
    const newErrors = {};

    if (!nuevaContraseña) {
      newErrors.nuevaContraseña = "Ingresa una nueva contraseña";
    } else if (nuevaContraseña.length < 8) {
      newErrors.nuevaContraseña = "Mínimo 8 caracteres";
    } else if (!/(?=.*[0-9])(?=.*[A-Z])/.test(nuevaContraseña)) {
      newErrors.nuevaContraseña = "Debe incluir mayúscula y número";
    }

    if (!confirmarContraseña) {
      newErrors.confirmarContraseña = "Confirma tu contraseña";
    } else if (nuevaContraseña !== confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generar código aleatorio
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Paso 1: Solicitar código
  const handleSendCode = () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    // Simular envío de código
    setTimeout(() => {
      const nuevoCodigo = generateCode();
      setCodigoEnviado(nuevoCodigo);
      setIsLoading(false);
      setStep(2);
      setTiempoRestante(300); // 5 minutos en segundos

      // Mostrar código en desarrollo (solo para testing)
      if (__DEV__) {
        Alert.alert(
          "Código de Verificación (DEV)",
          `Para desarrollo: ${nuevoCodigo}\n\nEn producción, este código sería enviado a tu correo.`,
          [{ text: "Continuar" }]
        );
      } else {
        Alert.alert(
          "Código Enviado",
          "Hemos enviado un código de 6 dígitos a tu correo electrónico.",
          [{ text: "Entendido" }]
        );
      }
    }, 1500);
  };

  // Paso 2: Verificar código
  const handleVerifyCode = () => {
    if (!validateCodigo()) return;

    setIsLoading(true);

    // Simular verificación
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      setErrors({});
    }, 1000);
  };

  // Paso 3: Cambiar contraseña
  const handleChangePassword = () => {
    if (!validatePassword()) return;

    setIsLoading(true);

    // Simular cambio de contraseña
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert(
        "¡Contraseña Actualizada!",
        "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
        [
          {
            text: "Iniciar Sesión",
            onPress: () => navigation.navigate("Login", {
              autoEmail: email,
              autoPassword: nuevaContraseña
            })
          }
        ]
      );
    }, 1500);
  };

  // Reenviar código
  const handleResendCode = () => {
    if (tiempoRestante > 0) {
      Alert.alert(
        "Espera un momento",
        `Puedes reenviar el código en ${tiempoRestante} segundos`
      );
      return;
    }

    const nuevoCodigo = generateCode();
    setCodigoEnviado(nuevoCodigo);
    setTiempoRestante(120); // 2 minutos para reenvío

    Alert.alert(
      "Código Reenviado",
      "Hemos enviado un nuevo código a tu correo.",
      [{ text: "Entendido" }]
    );
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render paso actual
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Paso 1: Ingresar email
  const renderStep1 = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name="email-outline" size={40} color="#007bff" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Recuperar Contraseña</Text>
      <Text style={styles.stepDescription}>
        Ingresa tu correo electrónico registrado. Te enviaremos un código de verificación.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico *</Text>
        <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
          <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="ejemplo@escuela.edu"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({});
            }}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Enviar Código</Text>
            <Icon name="send" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </>
  );

  // Paso 2: Ingresar código
  const renderStep2 = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name="shield-key" size={40} color="#FF9800" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Verificar Código</Text>
      <Text style={styles.stepDescription}>
        Ingresa el código de 6 dígitos que enviamos a:
        {"\n"}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Código de Verificación *</Text>
        <View style={[styles.inputWrapper, errors.codigo && styles.inputError]}>
          <Icon name="numeric" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="000000"
            value={codigo}
            onChangeText={(text) => {
              // Solo números y máximo 6 dígitos
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText.length <= 6) {
                setCodigo(numericText);
                if (errors.codigo) setErrors({});
              }
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />
        </View>
        {errors.codigo && <Text style={styles.errorText}>{errors.codigo}</Text>}
        
        {/* Timer para reenvío */}
        <View style={styles.timerContainer}>
          {tiempoRestante > 0 ? (
            <Text style={styles.timerText}>
              Puedes reenviar el código en {formatTime(tiempoRestante)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>¿No recibiste el código? Reenviar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.codeHint}>
        <Icon name="information" size={16} color="#666" />
        <Text style={styles.codeHintText}>
          El código expira en 5 minutos. Revisa también tu carpeta de spam.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Verificar Código</Text>
            <Icon name="check-circle" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setStep(1);
          setErrors({});
        }}
        disabled={isLoading}
      >
        <Icon name="arrow-left" size={20} color="#666" />
        <Text style={styles.secondaryButtonText}>Cambiar correo</Text>
      </TouchableOpacity>
    </>
  );

  // Paso 3: Nueva contraseña
  const renderStep3 = () => (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Icon name="lock-reset" size={40} color="#28a745" />
        </View>
      </View>

      <Text style={styles.stepTitle}>Nueva Contraseña</Text>
      <Text style={styles.stepDescription}>
        Crea una nueva contraseña segura para tu cuenta.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva Contraseña *</Text>
        <View style={[styles.inputWrapper, errors.nuevaContraseña && styles.inputError]}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Mínimo 8 caracteres"
            value={nuevaContraseña}
            onChangeText={(text) => {
              setNuevaContraseña(text);
              if (errors.nuevaContraseña) setErrors({});
            }}
            style={styles.input}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {errors.nuevaContraseña ? (
          <Text style={styles.errorText}>{errors.nuevaContraseña}</Text>
        ) : (
          <Text style={styles.helperText}>
            Debe incluir: 8+ caracteres, una mayúscula y un número
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar Contraseña *</Text>
        <View style={[styles.inputWrapper, errors.confirmarContraseña && styles.inputError]}>
          <Icon name="lock-check" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Repite tu nueva contraseña"
            value={confirmarContraseña}
            onChangeText={(text) => {
              setConfirmarContraseña(text);
              if (errors.confirmarContraseña) setErrors({});
            }}
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmarContraseña && (
          <Text style={styles.errorText}>{errors.confirmarContraseña}</Text>
        )}
      </View>

      <View style={styles.passwordRules}>
        <Text style={styles.rulesTitle}>Requisitos de seguridad:</Text>
        <View style={styles.ruleItem}>
          <Icon 
            name={nuevaContraseña.length >= 8 ? "check-circle" : "circle-outline"} 
            size={16} 
            color={nuevaContraseña.length >= 8 ? "#28a745" : "#666"} 
          />
          <Text style={styles.ruleText}>Mínimo 8 caracteres</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={/[A-Z]/.test(nuevaContraseña) ? "check-circle" : "circle-outline"} 
            size={16} 
            color={/[A-Z]/.test(nuevaContraseña) ? "#28a745" : "#666"} 
          />
          <Text style={styles.ruleText}>Al menos una mayúscula</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={/\d/.test(nuevaContraseña) ? "check-circle" : "circle-outline"} 
            size={16} 
            color={/\d/.test(nuevaContraseña) ? "#28a745" : "#666"} 
          />
          <Text style={styles.ruleText}>Al menos un número</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={nuevaContraseña === confirmarContraseña && nuevaContraseña.length > 0 ? "check-circle" : "circle-outline"} 
            size={16} 
            color={nuevaContraseña === confirmarContraseña && nuevaContraseña.length > 0 ? "#28a745" : "#666"} 
          />
          <Text style={styles.ruleText}>Las contraseñas coinciden</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
        onPress={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Cambiar Contraseña</Text>
            <Icon name="key-change" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          setStep(2);
          setErrors({});
        }}
        disabled={isLoading}
      >
        <Icon name="arrow-left" size={20} color="#666" />
        <Text style={styles.secondaryButtonText}>Volver al código</Text>
      </TouchableOpacity>
    </>
  );

  // Indicador de pasos
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNumber) => (
        <View key={stepNumber} style={styles.stepRow}>
          <View
            style={[
              styles.stepCircle,
              step === stepNumber && styles.stepCircleActive,
              step > stepNumber && styles.stepCircleCompleted,
            ]}
          >
            {step > stepNumber ? (
              <Icon name="check" size={16} color="#fff" />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  step === stepNumber && styles.stepNumberActive,
                  step > stepNumber && styles.stepNumberCompleted,
                ]}
              >
                {stepNumber}
              </Text>
            )}
          </View>
          {stepNumber < 3 && (
            <View
              style={[
                styles.stepLine,
                step > stepNumber && styles.stepLineCompleted,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (step > 1) {
                  setStep(step - 1);
                  setErrors({});
                } else {
                  navigation.goBack();
                }
              }}
            >
              <Icon name="arrow-left" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Indicador de pasos */}
          {renderStepIndicator()}

          {/* Contenido del paso actual */}
          <View style={styles.content}>
            {renderStep()}
          </View>

          {/* Enlace para iniciar sesión */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Información de seguridad */}
          <View style={styles.securityInfo}>
            <Icon name="shield-check" size={16} color="#666" />
            <Text style={styles.securityText}>
              Tu información está protegida. El proceso de recuperación es seguro y cifrado.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerPlaceholder: {
    width: 44,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginVertical: 30,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  stepCircleCompleted: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberCompleted: {
    color: '#fff',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#ddd',
  },
  stepLineCompleted: {
    backgroundColor: '#28a745',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  emailHighlight: {
    color: '#007bff',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  timerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timerText: {
    color: '#666',
    fontSize: 13,
  },
  resendLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  codeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 25,
  },
  codeHintText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
  },
  passwordRules: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#666',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  securityText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
