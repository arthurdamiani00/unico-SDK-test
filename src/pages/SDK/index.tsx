import { useState } from "react";
import {
  DocumentCameraType,
  DocumentCameraTypes,
  ErrorPictureResponse,
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
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [faceMatch, setFaceMatch] = useState("");
  const [documentImage, setDocumentImage] = useState("");

  function resetComponentStates() {
    setShowBoxCamera(false);
  }

  const urlPathModels = `${window.location.protocol}//${window.location.host}/models`;

  //const config = new UnicoConfig()
  //.setHostname("http://localhost:3000")
  //.setHostKey("sdkKey_31211990-b685-4db7-bf10-ffb2c5881807")

  const config = new UnicoConfig()
    .setHostname("")
    .setHostKey(
      "P91J3MEqiLX6IxFYCeI/esM3to25xC0wvAiAF66fkLJJHobxNVWouRKrtRVzhNqZ"
    );

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
    .setTheme(unicoTheme)
    .setModelsPath(urlPathModels)
    .setResourceDirectory("/resources")
    .setEnvironment(SDKEnvironmentTypes.UAT)
    .build();

  const onSuccessSmartSelfie = async (obj: SuccessPictureResponse) => {
    console.log("Smart Selfie Success:", obj);
    setFaceMatch(obj.base64);
    resetComponentStates();
  };

  const onSuccessDocumentRGFront = async (obj: SuccessPictureResponse) => {
    console.log("Document RG Front:", obj);
    setDocumentImage(obj.base64);
    resetComponentStates();
  };

  const onSuccessDocumentRGBack = async (obj: SuccessPictureResponse) => {
    console.log("Document RG back:", obj);
    // seu código específico para este caso
    resetComponentStates();
  };

  // Função de erro comum
  const onError = (error: ErrorPictureResponse) => {
    window.console.log(error);
    window.alert(`
        Câmera fechada
        ------------------------------------
        Motivo: ${error.code} - ${error.message} ${JSON.stringify(error.stack)}
    `);
    resetComponentStates();
  };

  const prepareSelfieCamera = async (
    jsonPath: string | UnicoConfig,
    cameraType: SelfieCameraType
  ) => {
    console.log(jsonPath);
    const { open } = await unicoCamera.prepareSelfieCamera(
      jsonPath,
      cameraType
    );

    open({ on: { success: onSuccessSmartSelfie, error: onError } });
    setShowBoxCamera(true);
  };

  const prepareDocumentCamera = async (
    jsonPath: string,
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
        documento: cpf,
        nome: name,
        biometriaFacial: faceMatch,
        imagemDocumento: documentImage,
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

      {!showBoxCamera && (
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
            {/* <button
              type="button"
              onClick={() => {
                prepareSelfieCamera(
                  config,
                  SelfieCameraTypes.NORMAL,
                  'Facetec Liveness',
                  true
                )
              }}
            >
              PrepareCamera Facetec
            </button> */}

            <button
              type="button"
              onClick={() => {
                prepareSelfieCamera("/services.json", SelfieCameraTypes.SMART);
              }}
            >
              Open selfie camera
            </button>

            <button
              type="button"
              onClick={() => {
                prepareDocumentCamera(
                  "/services.json",
                  DocumentCameraTypes.RG_FRENTE,
                  onSuccessDocumentRGFront
                );
              }}
            >
              Open document camera
            </button>
            {/* <button
              type="button"
              onClick={() => {
                prepareDocumentCamera(
                  '/services.json',
                  DocumentCameraTypes.CNH_FRENTE,
                  'CNH Frente',
                  true
                )
              }}
            >
              open CNH frnete
            </button>
            <button
              type="button"
              onClick={() => {
                prepareDocumentCamera(
                  '/services.json',
                  DocumentCameraTypes.CNH_VERSO,
                  'CNH verso',
                  true
                )
              }}
            >
              open CNH Verso
            </button> */}
            <button onClick={handleSubmit}>call workflow</button>
          </main>
        </div>
      )}
    </>
  );
}

export default SDK;
