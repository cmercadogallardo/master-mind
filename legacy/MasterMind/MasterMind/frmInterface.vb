Public Class frmInterface
    Dim oport As Integer = 10
    Private Sub frmInterface_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        Dim dtColores(4) As DataTable
        For n As Integer = 0 To dtColores.Length - 1
            dtColores(n) = New DataTable
            With dtColores(n)
                .Columns.Add("n")
                .Columns.Add("Color")
                .Rows.Add(1, "Azul")
                .Rows.Add(2, "Verde")
                .Rows.Add(3, "Amarillo")
                .Rows.Add(4, "Rojo")
                .Rows.Add(5, "Blanco")
            End With
        Next
        With cmb1
            .DataSource = dtColores(0)
            .ValueMember = "n"
            .DisplayMember = "Color"
        End With
        With cmb2
            .DataSource = dtColores(1)
            .ValueMember = "n"
            .DisplayMember = "Color"
        End With
        With cmb3
            .DataSource = dtColores(2)
            .ValueMember = "n"
            .DisplayMember = "Color"
        End With
        With cmb4
            .DataSource = dtColores(3)
            .ValueMember = "n"
            .DisplayMember = "Color"
        End With
        With cmb5
            .DataSource = dtColores(4)
            .ValueMember = "n"
            .DisplayMember = "Color"
        End With
    End Sub

    Private Sub btnIniciar_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnIniciar.Click
        btnLimpiar_Click(sender, e)
        Dim resultado As String
        resultado = cmb1.SelectedValue & cmb2.SelectedValue & cmb3.SelectedValue & cmb4.SelectedValue & cmb5.SelectedValue
        Dim clsAgente As New clsAgente()
        Dim ac As Integer = 0
        Dim posicion As Integer = 300
        For nturno As Integer = 1 To oport
            Dim strJugada As String = ""
            Dim arrJugada As Array
            arrJugada = clsAgente.jugar()
            For n As Integer = 0 To arrJugada.Length - 1
                '' construye salida de la jugada
                strJugada = strJugada & arrJugada(n).ToString()
            Next
            ac = 0
            For n As Integer = 0 To strJugada.Length - 1
                '' califica la jugada
                If strJugada(n) = resultado(n) Then
                    ac += 1
                End If
            Next
            '' pintar la jugada 
            ' Me.ListBox1.Items.Add(strJugada & "-->" & ac)
            Dim etiq(4) As Label
            Dim info As New Label
            Dim nLeft As Integer = 0
            For n As Integer = 0 To etiq.Length - 1
                etiq(n) = New Label
                Select Case arrJugada(n)
                    Case 1 : etiq(n).BackColor = Color.Blue
                    Case 2 : etiq(n).BackColor = Color.Green
                    Case 3 : etiq(n).BackColor = Color.Yellow
                    Case 4 : etiq(n).BackColor = Color.Red
                    Case 5 : etiq(n).BackColor = Color.White
                End Select
                etiq(n).Text = etiq(n).BackColor.ToString()
                etiq(n).Width = cmb1.Width
                etiq(n).Top = posicion
                etiq(n).Left = nLeft
                Me.panelMM.Controls.Add(etiq(n))
                nLeft += etiq(n).Width + 10
            Next
            posicion -= etiq(0).Height + 10
            If ac <> 5 Then
                clsAgente.nEx = ac
            Else
                MsgBox("Felicidades: Ha Encontrado la combinación original" & vbCrLf & "Movimientos: " & nturno)
                Exit For
            End If
        Next
    End Sub
    Private Sub btnLimpiar_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnLimpiar.Click
        For n As Integer = 0 To 10
            For Each control As Control In Me.panelMM.Controls
                Try
                    CType(control, Label).Dispose()
                Catch ex As Exception
                    '' no hace nada
                End Try
            Next
        Next
    End Sub

    Private Sub btnRandom_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnRandom.Click
        Dim clsAgente As New clsAgente
        Dim jugada As Array
        jugada = clsAgente.jugar()
        cmb1.SelectedIndex = jugada(0) - 1
        cmb2.SelectedIndex = jugada(1) - 1
        cmb3.SelectedIndex = jugada(2) - 1
        cmb4.SelectedIndex = jugada(3) - 1
        cmb5.SelectedIndex = jugada(4) - 1
    End Sub
End Class