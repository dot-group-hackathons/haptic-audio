package expo.modules.wearbridge

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import com.google.android.gms.wearable.Wearable
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WearBridgeModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("WearBridge")

        Events("onLabel")

        Function("sendLabelToWatch") { label: String, score: Double ->

            val context = appContext.reactContext

            if (context != null) {

                Wearable.getNodeClient(context)
                    .connectedNodes
                    .addOnSuccessListener { nodes ->

                        val payload = "$label|$score".toByteArray()

                        nodes.forEach { node ->
                            Wearable.getMessageClient(context)
                                .sendMessage(
                                    node.id,
                                    "/label",
                                    payload
                                )
                        }
                    }
            }

            null
        }

        Function("vibrate") {

            val context = appContext.reactContext

            if (context != null) {

                val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    val manager =
                        context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                    manager.defaultVibrator
                } else {
                    @Suppress("DEPRECATION")
                    context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(
                        VibrationEffect.createOneShot(
                            300,
                            VibrationEffect.DEFAULT_AMPLITUDE
                        )
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(300)
                }
            }

            null
        }
    }
}