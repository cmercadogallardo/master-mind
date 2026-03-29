<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class frmInterface
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing AndAlso components IsNot Nothing Then
            components.Dispose()
        End If
        MyBase.Dispose(disposing)
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.GroupBox1 = New System.Windows.Forms.GroupBox
        Me.cmb5 = New System.Windows.Forms.ComboBox
        Me.cmb4 = New System.Windows.Forms.ComboBox
        Me.cmb3 = New System.Windows.Forms.ComboBox
        Me.cmb2 = New System.Windows.Forms.ComboBox
        Me.cmb1 = New System.Windows.Forms.ComboBox
        Me.panelMM = New System.Windows.Forms.Panel
        Me.GroupBox2 = New System.Windows.Forms.GroupBox
        Me.btnRandom = New System.Windows.Forms.Button
        Me.btnLimpiar = New System.Windows.Forms.Button
        Me.btnIniciar = New System.Windows.Forms.Button
        Me.GroupBox1.SuspendLayout()
        Me.GroupBox2.SuspendLayout()
        Me.SuspendLayout()
        '
        'GroupBox1
        '
        Me.GroupBox1.Controls.Add(Me.cmb5)
        Me.GroupBox1.Controls.Add(Me.cmb4)
        Me.GroupBox1.Controls.Add(Me.cmb3)
        Me.GroupBox1.Controls.Add(Me.cmb2)
        Me.GroupBox1.Controls.Add(Me.cmb1)
        Me.GroupBox1.Controls.Add(Me.panelMM)
        Me.GroupBox1.Location = New System.Drawing.Point(12, 12)
        Me.GroupBox1.Name = "GroupBox1"
        Me.GroupBox1.Size = New System.Drawing.Size(365, 383)
        Me.GroupBox1.TabIndex = 0
        Me.GroupBox1.TabStop = False
        Me.GroupBox1.Text = "Jugar Mente Maestra"
        '
        'cmb5
        '
        Me.cmb5.BackColor = System.Drawing.SystemColors.Menu
        Me.cmb5.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cmb5.FormattingEnabled = True
        Me.cmb5.Location = New System.Drawing.Point(298, 22)
        Me.cmb5.Name = "cmb5"
        Me.cmb5.Size = New System.Drawing.Size(59, 21)
        Me.cmb5.TabIndex = 5
        '
        'cmb4
        '
        Me.cmb4.BackColor = System.Drawing.SystemColors.Menu
        Me.cmb4.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cmb4.FormattingEnabled = True
        Me.cmb4.Location = New System.Drawing.Point(225, 22)
        Me.cmb4.Name = "cmb4"
        Me.cmb4.Size = New System.Drawing.Size(59, 21)
        Me.cmb4.TabIndex = 4
        '
        'cmb3
        '
        Me.cmb3.BackColor = System.Drawing.SystemColors.Menu
        Me.cmb3.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cmb3.FormattingEnabled = True
        Me.cmb3.Location = New System.Drawing.Point(152, 22)
        Me.cmb3.Name = "cmb3"
        Me.cmb3.Size = New System.Drawing.Size(59, 21)
        Me.cmb3.TabIndex = 3
        '
        'cmb2
        '
        Me.cmb2.BackColor = System.Drawing.SystemColors.Menu
        Me.cmb2.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cmb2.FormattingEnabled = True
        Me.cmb2.Location = New System.Drawing.Point(79, 22)
        Me.cmb2.Name = "cmb2"
        Me.cmb2.Size = New System.Drawing.Size(59, 21)
        Me.cmb2.TabIndex = 2
        '
        'cmb1
        '
        Me.cmb1.BackColor = System.Drawing.SystemColors.Menu
        Me.cmb1.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList
        Me.cmb1.FormattingEnabled = True
        Me.cmb1.Location = New System.Drawing.Point(6, 22)
        Me.cmb1.Name = "cmb1"
        Me.cmb1.Size = New System.Drawing.Size(59, 21)
        Me.cmb1.TabIndex = 1
        '
        'panelMM
        '
        Me.panelMM.AutoScroll = True
        Me.panelMM.Location = New System.Drawing.Point(6, 49)
        Me.panelMM.Name = "panelMM"
        Me.panelMM.Size = New System.Drawing.Size(353, 328)
        Me.panelMM.TabIndex = 0
        '
        'GroupBox2
        '
        Me.GroupBox2.Controls.Add(Me.btnRandom)
        Me.GroupBox2.Controls.Add(Me.btnLimpiar)
        Me.GroupBox2.Controls.Add(Me.btnIniciar)
        Me.GroupBox2.Location = New System.Drawing.Point(383, 12)
        Me.GroupBox2.Name = "GroupBox2"
        Me.GroupBox2.Size = New System.Drawing.Size(128, 383)
        Me.GroupBox2.TabIndex = 1
        Me.GroupBox2.TabStop = False
        Me.GroupBox2.Text = "Comandos"
        '
        'btnRandom
        '
        Me.btnRandom.Location = New System.Drawing.Point(8, 78)
        Me.btnRandom.Name = "btnRandom"
        Me.btnRandom.Size = New System.Drawing.Size(115, 23)
        Me.btnRandom.TabIndex = 3
        Me.btnRandom.Text = "Buscar Reto"
        Me.btnRandom.UseVisualStyleBackColor = True
        '
        'btnLimpiar
        '
        Me.btnLimpiar.Location = New System.Drawing.Point(7, 49)
        Me.btnLimpiar.Name = "btnLimpiar"
        Me.btnLimpiar.Size = New System.Drawing.Size(116, 23)
        Me.btnLimpiar.TabIndex = 1
        Me.btnLimpiar.Text = "Limpiar Tablero"
        Me.btnLimpiar.UseVisualStyleBackColor = True
        '
        'btnIniciar
        '
        Me.btnIniciar.Location = New System.Drawing.Point(7, 19)
        Me.btnIniciar.Name = "btnIniciar"
        Me.btnIniciar.Size = New System.Drawing.Size(116, 23)
        Me.btnIniciar.TabIndex = 0
        Me.btnIniciar.Text = "Iniciar Juego"
        Me.btnIniciar.UseVisualStyleBackColor = True
        '
        'frmInterface
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(518, 402)
        Me.Controls.Add(Me.GroupBox2)
        Me.Controls.Add(Me.GroupBox1)
        Me.Name = "frmInterface"
        Me.Text = "Mente Maestra ::: Agente Inteligente"
        Me.GroupBox1.ResumeLayout(False)
        Me.GroupBox2.ResumeLayout(False)
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents GroupBox1 As System.Windows.Forms.GroupBox
    Friend WithEvents cmb5 As System.Windows.Forms.ComboBox
    Friend WithEvents cmb4 As System.Windows.Forms.ComboBox
    Friend WithEvents cmb3 As System.Windows.Forms.ComboBox
    Friend WithEvents cmb2 As System.Windows.Forms.ComboBox
    Friend WithEvents cmb1 As System.Windows.Forms.ComboBox
    Friend WithEvents panelMM As System.Windows.Forms.Panel
    Friend WithEvents GroupBox2 As System.Windows.Forms.GroupBox
    Friend WithEvents btnLimpiar As System.Windows.Forms.Button
    Friend WithEvents btnIniciar As System.Windows.Forms.Button
    Friend WithEvents btnRandom As System.Windows.Forms.Button
End Class
