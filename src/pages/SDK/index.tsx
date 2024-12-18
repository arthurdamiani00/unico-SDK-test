import { useState } from "react";
import {
  DocumentCameraType,
  DocumentCameraTypes,
  ErrorPictureResponse,
  LocaleType,
  LocaleTypes,
  SDKEnvironmentTypes,
  SelfieCameraType,
  SelfieCameraTypes,
  SuccessPictureResponse,
  UnicoCheckBuilder,
  UnicoConfig,
  UnicoThemeBuilder,
} from "unico-webframe";
import axios from "axios";

import "../../styles/global.css";
import "./styles.css";

function SDK() {
  const [showBoxCamera, setShowBoxCamera] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [faceMatch, setFaceMatch] = useState("");
  const [documentImageFront, setDocumentImageFront] = useState("");
  const [documentImageBack, setDocumentImageBack] = useState("");

  function resetComponentStates() {
    setShowBoxCamera(false);
    setShowIframe(false);
  }

  const urlPathModels = `${window.location.protocol}//${window.location.host}/models`;

  //const config = new UnicoConfig()
  //.setHostname("http://localhost:3000")
  //.setHostKey("sdkKey_31211990-b685-4db7-bf10-ffb2c5881807")

  const unicoTheme = new UnicoThemeBuilder()
    .setColorSilhouetteSuccess("#69c62f")
    .setColorSilhouetteError("#D50000")
    .setColorSilhouetteNeutral("#fcfcfc")
    .setBackgroundColor("#e9e9e9")
    .setColorText("#1362ca")
    .setBackgroundColorComponents("#325ad4")
    .setColorTextComponents("#dff1f5")
    .setBackgroundColorButtons("#406ee2")
    .setColorTextButtons("#dff1f5")
    .setBackgroundColorBoxMessage("#fff")
    .setColorTextBoxMessage("#366fd8")
    .setHtmlPopupLoading(
      `<div style="position: absolute; top: 45%; right: 50%; transform: translate(50%, -50%); z-index: 10; text-align: center;">Carregando...</div>`
    )
    .build();
  const unicoCamera = new UnicoCheckBuilder()
    .setLocale(LocaleTypes.PT_BR)
    .setEnvironment(SDKEnvironmentTypes.UAT)
    .setModelsPath(urlPathModels)
    .build();
  const config = new UnicoConfig()
    .setProjectNumber("01692624498539479")
    .setProjectId("sdk")
    .setMobileSdkAppId("sdk")
    .setHostname("http://localhost:3000")
    .setHostInfo(
      "nRMqSJJeWMZ0K4n9Dxs/Zhb5RslAxes+pmH0gJgmVtZdwNyOQ5wThBl1Sd+1hKs+D0gFCgAOsDVc6cWdPbtDMQ=="
    )
    .setHostKey(
      "P91J3MEqiLX6IxFYCeI/esM3to25xC0wvAiAF66fkLJJHobxNVWouRKrtRVzhNqZ"
    );

  const onSuccessSmartSelfie = async (obj: SuccessPictureResponse) => {
    console.log("Smart Selfie Success:", obj);
    setFaceMatch(obj.encrypted);
    resetComponentStates();
  };

  const onSuccessDocumentRGFront = async (obj: SuccessPictureResponse) => {
    console.log("Document CNH Front:", obj);
    setDocumentImageFront(obj.base64);
    resetComponentStates();
  };

  const onSuccessDocumentRGBack = async (obj: SuccessPictureResponse) => {
    console.log("Document CNH back:", obj);
    setDocumentImageBack(obj.base64);
    resetComponentStates();
  };

  // Função de erro comum
  const onError = (error: ErrorPictureResponse) => {
    console.log(error);
    resetComponentStates();
  };

  const prepareSelfieCamera = async (
    jsonPath: string | UnicoConfig,
    cameraType: SelfieCameraType
  ) => {
    const { open } = await unicoCamera.prepareSelfieCameraForIFrame(
      jsonPath,
      cameraType
    );

    open({ on: { success: onSuccessSmartSelfie, error: onError } });
    setShowIframe(true);
  };

  const prepareDocumentCamera = async (
    jsonPath: string | UnicoConfig,
    cameraType: DocumentCameraType,
    onSuccess: (obj: SuccessPictureResponse) => Promise<void>
  ) => {
    const { open } = await unicoCamera.prepareDocumentCamera(
      jsonPath,
      cameraType
    );

    open({ on: { success: onSuccess, error: onError } });
    setShowBoxCamera(true);
  };

  const handleSubmit = async () => {
    await axios
      .post(`http://localhost:3001/execute-workflow`, {
        code: cpf,
        name: name,
        clientDataBiometriaFacial: faceMatch,
        clientDataImagemDocumentoETipo: [
          { imageBase64: documentImageFront, type: "401" },
          { imageBase64: documentImageBack, type: "402" },
        ],
      })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div
        style={{
          display: showBoxCamera ? "inline" : "none",
        }}
      >
        <div id="box-camera"></div>
      </div>
      <div
        style={{
          display: showIframe ? "inline" : "none",
        }}
      >
        <iframe
          allow="fullscreen;camera;geolocation"
          allowFullScreen
          src="http://localhost:3000"
        ></iframe>
      </div>

      {!showBoxCamera && !showIframe && (
        <div className="main-container">
          <main>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />

            <button
              type="button"
              onClick={() => {
                prepareSelfieCamera(config, SelfieCameraTypes.SMART);
              }}
            >
              Open selfie camera
            </button>

            <button
              type="button"
              onClick={() => {
                prepareDocumentCamera(
                  config,
                  DocumentCameraTypes.CNH_FRENTE,
                  onSuccessDocumentRGFront
                );
              }}
            >
              Open document camera
            </button>
            <button
              type="button"
              onClick={() => {
                prepareDocumentCamera(
                  config,
                  DocumentCameraTypes.CNH_VERSO,
                  onSuccessDocumentRGBack
                );
              }}
            >
              Open document camera
            </button>
            <button onClick={handleSubmit}>call workflow</button>
          </main>
        </div>
      )}
    </>
  );
}

export default SDK;
