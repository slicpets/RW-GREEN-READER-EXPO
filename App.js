import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  const [ballSet, setBallSet] = useState(null);
  const [holeSet, setHoleSet] = useState(null);
  const [result, setResult] = useState(null);
  const [stimp, setStimp] = useState(10);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission needed</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function calculateReading() {
    const distanceFeet = 14;
    const slopePercent = 2.4;

    const breakInches =
      (slopePercent / 2) *
      (10 / stimp) *
      ((distanceFeet * distanceFeet) / 100) *
      12;

    setResult({
      distanceFeet,
      slopePercent,
      breakInches,
      aim:
        breakInches > 0
          ? `Aim ${breakInches.toFixed(1)} inches left`
          : `Aim ${Math.abs(breakInches).toFixed(1)} inches right`,
    });
  }

  function reset() {
    setBallSet(null);
    setHoleSet(null);
    setResult(null);
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <TouchableOpacity
          style={styles.fullscreen}
          activeOpacity={1}
          onPress={(event) => {
            const { locationX, locationY } = event.nativeEvent;

            if (!ballSet) {
              setBallSet({ x: locationX, y: locationY });
            } else if (!holeSet) {
              setHoleSet({ x: locationX, y: locationY });
            }
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>RW Green Reader</Text>

            <View style={styles.instructionsBox}>
              <Text style={styles.instructions}>
                {!ballSet
                  ? 'Tap ball position'
                  : !holeSet
                  ? 'Tap hole position'
                  : 'Ready to read green'}
              </Text>
            </View>

            {ballSet && (
              <View
                style={[
                  styles.ballMarker,
                  {
                    left: ballSet.x - 12,
                    top: ballSet.y - 12,
                  },
                ]}
              />
            )}

            {holeSet && (
              <View
                style={[
                  styles.holeMarker,
                  {
                    left: holeSet.x - 14,
                    top: holeSet.y - 14,
                  },
                ]}
              />
            )}

            <View style={styles.bottomPanel}>
              <View style={styles.stimpBox}>
                <Text style={styles.stimpText}>Green Speed: {stimp}</Text>

                <View style={styles.markerRow}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setStimp(Math.max(6, stimp - 1))}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setStimp(Math.min(14, stimp + 1))}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.scanButton}
                onPress={calculateReading}
                disabled={!ballSet || !holeSet}
              >
                <Text style={styles.scanText}>Read Green</Text>
              </TouchableOpacity>

              {result && (
                <View style={styles.resultBox}>
                  <Text style={styles.result}>
                    Distance: {result.distanceFeet.toFixed(1)} ft
                  </Text>

                  <Text style={styles.result}>
                    Slope: {result.slopePercent.toFixed(2)}%
                  </Text>

                  <Text style={styles.breakText}>{result.aim}</Text>

                  <TouchableOpacity style={styles.resetButton} onPress={reset}>
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  fullscreen: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  instructionsBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  instructions: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ballMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
  },
  holeMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  bottomPanel: {
    gap: 16,
  },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  stimpBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  stimpText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: 20,
    borderRadius: 14,
  },
  result: {
    fontSize: 18,
    marginBottom: 6,
  },
  breakText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});